import ProductRepository from '../../domain/repositories/product.repository';
import SalePriceDto from '../dtos/sale-price.dto';

type InputUpdateSalePrice = {
  productId: number;
  supermarketId: number;
  salePrice: number;
};

type OutputUpdateSalePrice = {
  salePrice: SalePriceDto;
};

export default class UpdateSalePriceUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputUpdateSalePrice): Promise<OutputUpdateSalePrice> {
    const salePrice = await this.productRepository.updateSalePrice(
      input.productId,
      input.supermarketId,
      input.salePrice,
    );

    return {
      salePrice: SalePriceDto.fromEntity(salePrice),
    };
  }
}
