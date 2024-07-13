import DescriptionProductVo from '../value-objects/description-product.vo';

export default class Product {
  #id: number;
  #description: DescriptionProductVo;
  #cost: number;
  #image?: Buffer;

  constructor(id: number, description: string, cost?: number, image?: Buffer) {
    this.#id = id;
    this.#description = new DescriptionProductVo(description);
    this.#cost = cost ? Number(cost) : 0;
    this.#image = image;
  }

  static create(description: string, cost?: number, image?: Buffer) {
    const id: number = 0;
    return new Product(id, description, cost, image);
  }

  get id(): number {
    return this.#id;
  }

  get description(): string {
    return this.#description.value;
  }

  get cost(): number {
    return this.#cost;
  }

  get image(): Buffer | null {
    return this.#image;
  }
}
