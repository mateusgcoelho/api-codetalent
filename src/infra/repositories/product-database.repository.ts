import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import FilterFindProducts from '../../domain/dtos/filter-find-products.dto';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import Shop from '../../domain/entities/shop';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductModel from '../models/product.model';
import SalePriceModel from '../models/sale-price.model';

@Injectable()
export default class ProductRepositoryDatabase implements ProductRepository {
  constructor(
    @InjectRepository(ProductModel)
    private readonly ormProductRepository: Repository<ProductModel>,
    @InjectRepository(SalePriceModel)
    private readonly ormSalePriceRepository: Repository<SalePriceModel>,
  ) {}

  async findProductSalesPrices(
    productId: number,
  ): Promise<[Product, SalePrice[]]> {
    const productModel = await this.ormProductRepository.findOne({
      where: { id: productId },
    });

    if (!productModel) {
      throw new Error();
    }

    const salePriceModels = await this.ormSalePriceRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: ['product', 'shop'],
    });

    const product: Product = new Product(
      productModel.id,
      productModel.description,
      productModel.cost,
    );
    const salesPrices: SalePrice[] = salePriceModels.map(
      (model) =>
        new SalePrice(
          new Shop(model.shop.id, model.shop.description),
          model.product.id,
          model.salePrice,
        ),
    );

    return [product, salesPrices];
  }

  async saveSalePrice(salePrice: SalePrice): Promise<SalePrice> {
    console.log(salePrice);
    const salePriceFinded = await this.ormSalePriceRepository.findOne({
      where: {
        shop: {
          id: salePrice.shop.id,
        },
      },
    });

    if (salePriceFinded) {
      throw new Error();
    }

    const productModel = await this.ormProductRepository.findOne({
      where: {
        id: salePrice.productId,
      },
    });

    if (!productModel) {
      throw new Error();
    }

    const salePriceModel = await this.ormSalePriceRepository.save({
      product: { id: productModel.id },
      shop: salePrice.shop,
      salePrice: salePrice.salePrice,
    });

    return new SalePrice(
      salePrice.shop,
      salePriceModel.product.id,
      salePriceModel.salePrice,
    );
  }

  async save(product: Product): Promise<Product> {
    const modelCreated = await this.ormProductRepository.save({
      description: product.description,
      cost: product.cost,
    });

    return new Product(
      modelCreated.id,
      modelCreated.description,
      modelCreated.cost,
    );
  }

  async find(filter: FilterFindProducts): Promise<[Product[], number]> {
    let where: FindOptionsWhere<ProductModel> = {};

    if (filter.productId) {
      where.id = filter.productId;
    }

    if (filter.description) {
      where.description = ILike(`${filter.description}%`);
    }

    if (filter.cost) {
      where.cost = filter.cost;
    }

    const [models, total] = await this.ormProductRepository.findAndCount({
      where,
    });

    const products: Product[] = models.map(
      (model) => new Product(model.id, model.description, model.cost),
    );

    return [products, total];
  }
}
