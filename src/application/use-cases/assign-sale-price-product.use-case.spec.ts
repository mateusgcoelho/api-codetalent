import { DataSource } from 'typeorm';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ShopRepository from '../../domain/repositories/shop.repository';
import ProductModel from '../../infra/models/product.model';
import SalePriceModel from '../../infra/models/sale-price.model';
import ShopModel from '../../infra/models/shop.model';
import ProductRepositoryDatabase from '../../infra/repositories/product-database.repository';
import ShopRepositoryDatabase from '../../infra/repositories/shop-database.repository';
import AssignSalePriceProductUseCase from './assign-sale-price-product.use-case';

describe('AssignSalesPriceProductUseCase', () => {
  let dataSource: DataSource;
  let productRepository: ProductRepository;
  let shopRepository: ShopRepository;
  let assignSalePriceProduct: AssignSalePriceProductUseCase;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [ProductModel, SalePriceModel, ShopModel],
      synchronize: true,
    });
    await dataSource.initialize();

    const ormShopRepository = dataSource.getRepository(ShopModel);
    const ormProductRepository = dataSource.getRepository(ProductModel);
    const ormSalePriceRepository = dataSource.getRepository(SalePriceModel);

    productRepository = new ProductRepositoryDatabase(
      ormProductRepository,
      ormSalePriceRepository,
    );
    shopRepository = new ShopRepositoryDatabase(ormShopRepository);
    assignSalePriceProduct = new AssignSalePriceProductUseCase(
      productRepository,
      shopRepository,
    );

    await ormShopRepository.save({
      id: 1,
      description: 'LOJA 1',
    });
    await ormProductRepository.save({
      id: 1,
      description: 'COSTELA KG',
      cost: 25.5,
    });
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('', async function () {
    const inputAssignSalesPriceProduct = {
      shopId: 1,
      productId: 1,
      salePrice: 55.3,
    };
    const outputCreateProduct = await assignSalePriceProduct.execute(
      inputAssignSalesPriceProduct,
    );

    expect(outputCreateProduct.product).toBeInstanceOf(Product);
    expect(outputCreateProduct.salesPrices).toBeInstanceOf(Array<SalePrice>);
    expect(outputCreateProduct).toEqual({
      product: {
        id: 1,
        cost: 25.5,
        description: 'COSTELA KG',
      },
      salesPrices: [
        {
          productId: 1,
          shop: {
            id: 1,
            description: 'LOJA 1',
          },
          salePrice: 55.3,
        },
      ],
    });
  });
});
