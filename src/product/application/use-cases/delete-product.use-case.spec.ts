import ProductRepository from '../../domain/repositories/product.repository';
import DeleteProductUseCase from './delete-product.use-case';

describe('DeleteProductUseCase', () => {
  let productRepository: jest.Mocked<ProductRepository>;
  let deleteProduct: DeleteProductUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn(),
      save: jest.fn(),
      saveSalePrice: jest.fn(),
      findProductSalesPrices: jest.fn(),
      updateSalePrice: jest.fn(),
      deleteSalePrice: jest.fn(),
      delete: jest.fn().mockResolvedValue(null),
    };
    deleteProduct = new DeleteProductUseCase(productRepository);
  });

  test(`
    Given a productId,
    When call delete usecase to the product,
    Then it should be delete and return void
  `, async function () {
    const inputDeleteProduct = {
      productId: 1,
    };
    const outputCreateProduct = await deleteProduct.execute(inputDeleteProduct);

    expect(outputCreateProduct).toBe(undefined);
  });
});
