import Supermarket from '../../../supermarket/domain/entities/supermarket';
import SupermarketRepository from '../../../supermarket/domain/repositories/supermarket.repository';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import SalePriceDto from '../dtos/sale-price.dto';
import AssignSalePriceProductUseCase from './assign-sale-price-product.use-case';

describe('AssignSalesPriceProductUseCase', () => {
  const mockSupermarket: Supermarket = new Supermarket(1, 'LOJA TESTE');
  const mockProduct: Product = new Product(1, 'COSTELA KG', 25.5);
  const mockSalesPrices: SalePrice[] = [
    new SalePrice(mockSupermarket, 1, 24.5),
  ];

  let productRepository: jest.Mocked<ProductRepository>;
  let supermarketRepository: SupermarketRepository;
  let assignSalePriceProduct: AssignSalePriceProductUseCase;

  beforeEach(async () => {
    productRepository = {
      findProductSalesPrices: jest
        .fn()
        .mockResolvedValue([mockProduct, mockSalesPrices]),
      save: jest.fn(),
      saveSalePrice: jest.fn(),
      findAndCount: jest.fn(),
      delete: jest.fn(),
      deleteSalePrice: jest.fn(),
      updateSalePrice: jest.fn(),
    };

    supermarketRepository = {
      findOrThrow: jest.fn().mockResolvedValue(mockSupermarket),
      findAll: jest.fn(),
    };

    assignSalePriceProduct = new AssignSalePriceProductUseCase(
      productRepository,
      supermarketRepository,
    );
  });

  it(`
    Given a productId, a supermarketId and a salePrice,
    When not exists a sale price for product and supermarket,
    Then it should be create a new sale price and return it
  `, async function () {
    const inputAssignSalesPriceProduct = {
      supermarketId: 1,
      productId: 1,
      salePrice: 55.3,
    };
    const outputCreateProduct = await assignSalePriceProduct.execute(
      inputAssignSalesPriceProduct,
    );

    expect(outputCreateProduct.product).toBeInstanceOf(ProductDto);
    expect(outputCreateProduct.salesPrices).toBeInstanceOf(Array<SalePriceDto>);
    expect(outputCreateProduct).toEqual({
      product: {
        id: 1,
        cost: 25.5,
        description: 'COSTELA KG',
        image: undefined,
      },
      salesPrices: [
        {
          productId: 1,
          supermarket: {
            id: 1,
            description: 'LOJA TESTE',
          },
          salePrice: 24.5,
        },
      ],
    });
  });
});
