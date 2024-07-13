import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';

type InputCreateProduct = {
  description: string;
  cost?: number | undefined;
  image?: Buffer | undefined;
};

type OutputCreateProduct = {
  product: ProductDto;
};

export default class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputCreateProduct): Promise<OutputCreateProduct> {
    const productInput = Product.create(
      input.description,
      input.cost,
      input.image,
    );

    const product = await this.productRepository.save(productInput);

    return {
      product: ProductDto.fromEntity(product),
    };
  }
}
