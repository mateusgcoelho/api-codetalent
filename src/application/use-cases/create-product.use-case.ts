import { Inject, Injectable } from '@nestjs/common';
import Product from '../../domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';

type InputCreateProduct = {
  description: string;
  cost?: number;
};

type OutputCreateProduct = {
  product: Product;
};

@Injectable()
export default class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: InputCreateProduct): Promise<OutputCreateProduct> {
    const productInput = Product.create(input.description, input.cost);

    const product = await this.productRepository.save(productInput);

    return {
      product,
    };
  }
}
