import { DataSource } from 'typeorm';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductModel from '../../infra/models/product.model';
import SalePriceModel from '../../infra/models/sale-price.model';
import ShopModel from '../../infra/models/shop.model';
import ProductRepositoryDatabase from '../../infra/repositories/product-database.repository';
import FindProductsUseCase from './find-products.use-case';

describe('FindProductsUseCase', () => {
  let dataSource: DataSource;
  let productRepository: ProductRepository;
  let findProducts: FindProductsUseCase;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [ProductModel, ShopModel, SalePriceModel],
      synchronize: true,
    });
    await dataSource.initialize();

    const ormProductRepository = dataSource.getRepository(ProductModel);
    const ormSalePriceRepository = dataSource.getRepository(SalePriceModel);

    productRepository = new ProductRepositoryDatabase(
      ormProductRepository,
      ormSalePriceRepository,
    );
    findProducts = new FindProductsUseCase(productRepository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('Given products in the database, when retrieving all products, then all products should be returned', async function () {
    const product = Product.create('COSTELA BOVINA KG', 24.54);
    await productRepository.save(product);

    const inputFindProducts = {};
    const outputFindProducts = await findProducts.execute(inputFindProducts);

    expect(outputFindProducts.products.length).toEqual(1);
    expect(outputFindProducts).toEqual({
      products: [
        {
          id: 1,
          cost: 24.54,
          description: 'COSTELA BOVINA KG',
        },
      ],
      total: 1,
    });
  });
});
