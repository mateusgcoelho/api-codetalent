import SalePrice from '../../../product/domain/entities/sale-price';
import SupermarketDto from '../../../supermarket/application/dtos/supermarket.dto';

export default class SalePriceDto {
  constructor(
    readonly productId: number,
    readonly supermarket: SupermarketDto,
    readonly salePrice: number,
  ) {}

  static fromEntity(entity: SalePrice): SalePriceDto {
    return new SalePriceDto(
      entity.productId,
      SupermarketDto.fromEntity(entity.supermarket),
      Number(entity.salePrice),
    );
  }
}
