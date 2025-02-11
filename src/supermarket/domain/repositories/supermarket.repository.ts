import Supermarket from '../entities/supermarket';

export default interface SupermarketRepository {
  findAll(): Promise<Supermarket[]>;
  findOrThrow(supermarketId: number): Promise<Supermarket>;
}
