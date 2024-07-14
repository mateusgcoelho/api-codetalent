import ProductRepository from '../../domain/repositories/product.repository';
import DeleteSalePriceUseCase from './delete-sale-price.use-case';

describe('DeleteSalePriceUseCase', () => {
  let productRepository: jest.Mocked<ProductRepository>;
  let deleteSalePrice: DeleteSalePriceUseCase;

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
    deleteSalePrice = new DeleteSalePriceUseCase(productRepository);
  });

  test(`
    Given a productId and supermarketId,
    When call delete usecase to the product sale price,
    Then it should be delete and return void
  `, async function () {
    const inputDeleteSalePrice = {
      productId: 1,
      supermarketId: 1,
    };
    const outputCreateProduct =
      await deleteSalePrice.execute(inputDeleteSalePrice);

    expect(outputCreateProduct).toBe(undefined);
  });
});
