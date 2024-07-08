import Shop from '../entities/shop';

export default interface ShopRepository {
  get(shopId: number): Promise<Shop | null>;
}
