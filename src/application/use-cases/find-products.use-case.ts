import { Inject, Injectable } from '@nestjs/common';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';

type InputFindProducts = {
  productId?: number;
  description?: string;
  cost?: number;
  price?: number;
};

type OutputFindProducts = {
  products: Product[];
  total: number;
};

@Injectable()
export default class FindProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: InputFindProducts): Promise<OutputFindProducts> {
    const [products, total] = await this.productRepository.find(input);

    return {
      products,
      total,
    };
  }
}
