import SalePrice from '@product/domain/entities/sale-price';
import Supermarket from '@supermarket/domain/entities/supermarket';
import ProductRepository from '../../domain/repositories/product.repository';
import SalePriceDto from '../dtos/sale-price.dto';
import UpdateSalePriceUseCase from './update-sale-price.use-case';

describe('UpdateSalePriceUseCase', () => {
  const mockSalePrice = new SalePrice(new Supermarket(1, 'LOJA 1'), 1, 54.2);

  let productRepository: jest.Mocked<ProductRepository>;
  let updateSalePrice: UpdateSalePriceUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn(),
      save: jest.fn(),
      saveSalePrice: jest.fn(),
      findProductSalesPrices: jest.fn(),
      updateSalePrice: jest.fn().mockResolvedValue(mockSalePrice),
      deleteSalePrice: jest.fn(),
      delete: jest.fn(),
    };

    updateSalePrice = new UpdateSalePriceUseCase(productRepository);
  });

  test(`
    Given a sales price of the product already registered,
    When new sales price information is sent,
    Then an update must occur
  `, async function () {
    const outputUpdateSalePrice = await updateSalePrice.execute({
      productId: 1,
      supermarketId: 1,
      salePrice: 24,
    });

    expect(outputUpdateSalePrice.salePrice).toBeInstanceOf(SalePriceDto);
    expect(outputUpdateSalePrice).toEqual({
      salePrice: {
        productId: 1,
        salePrice: 54.2,
        supermarket: {
          description: 'LOJA 1',
          id: 1,
        },
      },
    });
  });
});
