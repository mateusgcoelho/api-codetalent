import Supermarket from '@supermarket/domain/entities/supermarket';

export default class SupermarketDto {
  constructor(
    readonly id: number,
    readonly description: string,
  ) {}

  static fromEntity(entity: Supermarket): SupermarketDto {
    return new SupermarketDto(entity.id, entity.description);
  }
}
