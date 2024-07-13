import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';
import SalePriceDto from '../dtos/sale-price.dto';

type InputGetProduct = {
  productId: number;
};

type OutputGetProduct = {
  product: ProductDto;
  salesPrices: SalePriceDto[];
};

export default class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputGetProduct): Promise<OutputGetProduct> {
    const [product, salesPrices] =
      await this.productRepository.findProductSalesPrices(input.productId);

    return {
      product: ProductDto.fromEntity(product),
      salesPrices: salesPrices.map((entity) => SalePriceDto.fromEntity(entity)),
    };
  }
}
