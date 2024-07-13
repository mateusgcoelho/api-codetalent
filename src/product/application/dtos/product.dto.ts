import Product from '@product/domain/entities/product';

export default class ProductDto {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly cost: number,
    readonly image?: Buffer,
  ) {}

  static fromEntity(entity: Product): ProductDto {
    return new ProductDto(
      entity.id,
      entity.description,
      entity.cost,
      entity.image,
    );
  }
}
