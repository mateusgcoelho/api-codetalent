import Supermarket from '../../../supermarket/domain/entities/supermarket';

export default class SalePrice {
  #supermarket: Supermarket;
  #productId: number;
  #salePrice: number;

  constructor(supermarket: Supermarket, productId: number, salePrice: number) {
    this.#supermarket = supermarket;
    this.#productId = productId;
    this.#salePrice = salePrice;
  }

  static create(
    supermarket: Supermarket,
    productId: number,
    salePrice: number,
  ) {
    return new SalePrice(supermarket, productId, salePrice);
  }

  get supermarket(): Supermarket {
    return this.#supermarket;
  }

  get productId(): number {
    return this.#productId;
  }

  get salePrice(): number {
    return this.#salePrice;
  }
}
