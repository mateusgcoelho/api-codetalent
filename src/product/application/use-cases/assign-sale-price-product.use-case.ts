import Supermarket from '../../../supermarket/domain/entities/supermarket';
import SupermarketRepository from '../../../supermarket/domain/repositories/supermarket.repository';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import SalePriceDto from '../dtos/sale-price.dto';

type InputAssignSalePriceProduct = {
  productId: number;
  supermarketId: number;
  salePrice: number;
};

type OutputAssignSalePriceProduct = {
  product: ProductDto;
  salesPrices: SalePriceDto[];
};

export default class AssignSalePriceProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly supermarketRepository: SupermarketRepository,
  ) {}

  async execute(
    input: InputAssignSalePriceProduct,
  ): Promise<OutputAssignSalePriceProduct> {
    const supermarketModel = await this.supermarketRepository.findOrThrow(
      input.supermarketId,
    );

    const supermarket = new Supermarket(
      supermarketModel.id,
      supermarketModel.description,
    );
    const salePrice = SalePrice.create(
      supermarket,
      input.productId,
      input.salePrice,
    );
    await this.productRepository.saveSalePrice(salePrice);

    const [product, salesPrices] =
      await this.productRepository.findProductSalesPrices(input.productId);

    return {
      product: ProductDto.fromEntity(product),
      salesPrices: salesPrices.map((entity) => SalePriceDto.fromEntity(entity)),
    };
  }
}
