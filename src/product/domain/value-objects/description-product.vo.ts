import { EmptyDescriptionProductError } from './errors/empty-description-product.error';
import { LimitSizeDescriptionProductError } from './errors/limit-size-description-product.error';

export default class DescriptionProductVo {
  static MAX_LENGTH: number = 60;

  #value: string;

  constructor(value: string) {
    if (value == '') {
      throw new EmptyDescriptionProductError();
    }

    if (value.length > DescriptionProductVo.MAX_LENGTH) {
      throw new LimitSizeDescriptionProductError();
    }

    this.#value = value;
  }

  get value(): string {
    return this.#value;
  }
}
