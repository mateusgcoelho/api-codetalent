import Product from '../../../product/domain/entities/product';
import SalePrice from '../../../product/domain/entities/sale-price';
import Supermarket from '../../../supermarket/domain/entities/supermarket';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import GetProductUseCase from './get-product.use-case';

describe('GetProductUseCase', () => {
  const mockSupermarket: Supermarket = new Supermarket(1, 'LOJA TESTE');
  const mockProduct: Product = new Product(1, 'COSTELA BOVINA KG', 24.54);
  const mockSalesPrices: SalePrice[] = [
    new SalePrice(mockSupermarket, 1, 24.5),
  ];

  let productRepository: jest.Mocked<ProductRepository>;
  let getProduct: GetProductUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn(),
      saveSalePrice: jest.fn(),
      save: jest.fn(),
      findProductSalesPrices: jest
        .fn()
        .mockResolvedValue([mockProduct, mockSalesPrices]),
    };

    getProduct = new GetProductUseCase(productRepository);
  });

  test(`
    Given products in the database
    when retrieving a product existent
    then product should be returned
  `, async function () {
    const outputGetProduct = await getProduct.execute({
      productId: 1,
    });

    expect(outputGetProduct.product).toBeInstanceOf(ProductDto);
    expect(outputGetProduct).toEqual({
      product: {
        id: 1,
        cost: 24.54,
        description: 'COSTELA BOVINA KG',
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
