import { DataSource } from 'typeorm';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductModel from '../../infra/models/product.model';
import SalePriceModel from '../../infra/models/sale-price.model';
import ShopModel from '../../infra/models/shop.model';
import ProductRepositoryDatabase from '../../infra/repositories/product-database.repository';
import CreateProductUseCase from './create-product.use-case';

describe('CreateProductUseCase', () => {
  let dataSource: DataSource;
  let productRepository: ProductRepository;
  let createProduct: CreateProductUseCase;

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
    createProduct = new CreateProductUseCase(productRepository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  test('Given a product, when creating the product, then it should be saved in the database and returned', async function () {
    const inputCreateProduct = {
      description: 'COSTELA BOVINA KG',
      cost: 24.54,
    };
    const outputCreateProduct = await createProduct.execute(inputCreateProduct);

    expect(outputCreateProduct.product.id).toBeDefined();
    expect(outputCreateProduct.product).toBeInstanceOf(Product);
    expect(outputCreateProduct).toEqual({
      product: {
        id: 1,
        cost: 24.54,
        description: 'COSTELA BOVINA KG',
      },
    });
  });
});
