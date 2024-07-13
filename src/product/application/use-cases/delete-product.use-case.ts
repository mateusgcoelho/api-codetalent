import ProductRepository from '../../domain/repositories/product.repository';

type InputDeleteProduct = {
  productId: number;
};

export default class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputDeleteProduct): Promise<void> {
    await this.productRepository.delete(input.productId);
  }
}
