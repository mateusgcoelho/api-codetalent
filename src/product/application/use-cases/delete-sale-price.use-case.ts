import ProductRepository from '../../domain/repositories/product.repository';

type InputDeleteSalePrice = {
  productId: number;
  supermarketId: number;
};

export default class DeleteSalePriceUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputDeleteSalePrice): Promise<void> {
    await this.productRepository.deleteSalePrice(
      input.productId,
      input.supermarketId,
    );
  }
}
