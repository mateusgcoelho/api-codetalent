export default class Product {
  constructor(
    readonly id: number,
    readonly description: string,
    readonly cost?: number,
  ) {
    this.cost = cost ? Number(cost) : 0;
  }

  static create(description: string, cost?: number) {
    const id: number = 0;
    return new Product(id, description, cost);
  }
}
