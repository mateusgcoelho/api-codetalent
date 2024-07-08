import { Inject, Injectable } from '@nestjs/common';
import Shop from 'src/domain/entities/shop';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ShopRepository from '../../domain/repositories/shop.repository';

type InputAssignSalePriceProduct = {
  productId: number;
  shopId: number;
  salePrice: number;
};

type OutputAssignSalePriceProduct = {
  product: Product;
  salesPrices: SalePrice[];
};

@Injectable()
export default class AssignSalePriceProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ShopRepository')
    private readonly shopRepository: ShopRepository,
  ) {}

  async execute(
    input: InputAssignSalePriceProduct,
  ): Promise<OutputAssignSalePriceProduct> {
    const shopModel = await this.shopRepository.get(input.shopId);

    if (!shopModel) {
      throw new Error();
    }

    const shop = new Shop(shopModel.id, shopModel.description);
    const salePrice = SalePrice.create(shop, input.productId, input.salePrice);
    await this.productRepository.saveSalePrice(salePrice);

    const [product, salesPrices] =
      await this.productRepository.findProductSalesPrices(input.productId);

    return {
      product,
      salesPrices,
    };
  }
}
