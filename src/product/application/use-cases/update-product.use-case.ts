import Product from '@product/domain/entities/product';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductDto from '../dtos/product.dto';

type InputUpdateProduct = {
  productId: number;
  description?: string | undefined;
  cost?: number | undefined;
  image?: Buffer | undefined;
};

type OutputUpdateProduct = {
  product: ProductDto;
};

export default class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: InputUpdateProduct): Promise<OutputUpdateProduct> {
    const [product, _] = await this.productRepository.findProductSalesPrices(
      input.productId,
    );

    let description: string = product.description;
    let cost: number | undefined = product.cost;
    let image: Buffer | undefined =
      input.image == null
        ? null
        : input.image != undefined
          ? input.image
          : product.image;

    if (input.description && input.description != product.description) {
      description = input.description;
    }

    if (input.cost && input.cost != product.cost) {
      cost = input.cost;
    }

    const entityToUpdate = new Product(product.id, description, cost, image);
    const productUpdated = await this.productRepository.save(entityToUpdate);

    return {
      product: ProductDto.fromEntity(productUpdated),
    };
  }
}
