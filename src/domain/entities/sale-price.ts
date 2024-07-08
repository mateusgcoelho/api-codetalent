import Shop from './shop';

export default class SalePrice {
  constructor(
    readonly shop: Shop,
    readonly productId: number,
    readonly salePrice: number,
  ) {}

  static create(shop: Shop, productId: number, salePrice: number) {
    return new SalePrice(shop, productId, salePrice);
  }
}
