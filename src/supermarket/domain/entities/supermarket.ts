export default class Supermarket {
  #id: number;
  #description: string;

  constructor(id: number, description: string) {
    this.#id = id;
    this.#description = description;
  }

  get id(): number {
    return this.#id;
  }

  get description(): string {
    return this.#description;
  }
}
