import Product from '../../../product/domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import FindProductsUseCase from './find-products.use-case';

describe('FindProductsUseCase', () => {
  const mockProduct = new Product(1, 'COSTELA BOVINA KG', 24.54);

  let productRepository: jest.Mocked<ProductRepository>;
  let findProducts: FindProductsUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
      saveSalePrice: jest.fn(),
      save: jest.fn(),
      findProductSalesPrices: jest.fn(),
      updateSalePrice: jest.fn(),
      deleteSalePrice: jest.fn(),
      delete: jest.fn(),
    };

    findProducts = new FindProductsUseCase(productRepository);
  });

  test(`
    Given products in the database,
    When retrieving all products,
    Then all products should be returned
  `, async function () {
    const outputFindProducts = await findProducts.execute({
      page: 1,
      perPage: 10,
    });

    expect(outputFindProducts.products.length).toEqual(1);
    expect(outputFindProducts).toEqual({
      products: [
        {
          id: 1,
          cost: 24.54,
          description: 'COSTELA BOVINA KG',
          image: undefined,
        },
      ],
      total: 1,
      maxPage: 1,
    });
  });
});
