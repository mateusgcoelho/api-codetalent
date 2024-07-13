import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';

type InputFindProducts = {
  productId?: number;
  description?: string;
  cost?: number;
  price?: number;
  page: number;
  perPage: number;
};

type OutputFindProducts = {
  products: ProductDto[];
  maxPage: number;
  total: number;
};

export default class FindProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputFindProducts): Promise<OutputFindProducts> {
    const [products, total] = await this.productRepository.findAndCount(input);

    return {
      products: products.map((entity) => ProductDto.fromEntity(entity)),
      maxPage: Math.ceil(total / input.perPage),
      total,
    };
  }
}
