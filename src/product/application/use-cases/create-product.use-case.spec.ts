import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import CreateProductUseCase from './create-product.use-case';

describe('CreateProductUseCase', () => {
  const mockProduct: Product = new Product(1, 'COSTELA BOVINA KG', 24.4);

  let productRepository: jest.Mocked<ProductRepository>;
  let createProduct: CreateProductUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn(),
      save: jest.fn().mockResolvedValue(mockProduct),
      saveSalePrice: jest.fn(),
      findProductSalesPrices: jest.fn(),
    };
    createProduct = new CreateProductUseCase(productRepository);
  });

  test(`
    Given a product
    when creating the product
    then it should be create and return it
  `, async function () {
    const inputCreateProduct = {
      description: 'COSTELA BOVINA KG',
      cost: 24.54,
    };
    const outputCreateProduct = await createProduct.execute(inputCreateProduct);

    expect(outputCreateProduct.product.id).toBeDefined();
    expect(outputCreateProduct.product).toBeInstanceOf(ProductDto);
    expect(outputCreateProduct).toEqual({
      product: {
        id: 1,
        cost: 24.4,
        description: 'COSTELA BOVINA KG',
        image: undefined,
      },
    });
  });
});
