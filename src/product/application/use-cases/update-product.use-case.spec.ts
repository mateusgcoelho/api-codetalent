import Supermarket from '../../../supermarket/domain/entities/supermarket';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import UpdateProductUseCase from './update-product.use-case';

describe('UpdateProductUseCase', () => {
  const mockSupermarket: Supermarket = new Supermarket(1, 'LOJA TESTE');
  const mockProduct: Product = new Product(1, 'COSTELA BOVINA KG', 24.54);
  const mockProductUpdated: Product = new Product(1, 'NOVA DESCRICAO', 24);
  const mockSalesPrices: SalePrice[] = [
    new SalePrice(mockSupermarket, 1, 24.5),
  ];

  let productRepository: jest.Mocked<ProductRepository>;
  let updateProduct: UpdateProductUseCase;

  beforeEach(async () => {
    productRepository = {
      findAndCount: jest.fn(),
      saveSalePrice: jest.fn(),
      save: jest.fn().mockResolvedValue(mockProductUpdated),
      findProductSalesPrices: jest
        .fn()
        .mockResolvedValue([mockProduct, mockSalesPrices]),
      updateSalePrice: jest.fn(),
      deleteSalePrice: jest.fn(),
      delete: jest.fn(),
    };

    updateProduct = new UpdateProductUseCase(productRepository);
  });

  test(`
    Given an already registered product,
    When new product information is sent,
    Then an update must occur
  `, async function () {
    const outputUpdateProduct = await updateProduct.execute({
      productId: 1,
      cost: 24,
      description: 'NOVA DESCRICAO',
    });

    expect(outputUpdateProduct.product).toBeInstanceOf(ProductDto);
    expect(outputUpdateProduct).toEqual({
      product: {
        id: 1,
        cost: 24,
        description: 'NOVA DESCRICAO',
        image: undefined,
      },
    });
  });
});
