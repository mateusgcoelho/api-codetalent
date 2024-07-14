import SalePriceAlreadyExistsError from '@product/domain/errors/sale-price-already-exists.error';
import SalePriceNotFound from '@product/domain/errors/sale-price-not-found.error';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import ProductNotFoundError from '../../../product/domain/errors/product-not-found.error';
import Supermarket from '../../../supermarket/domain/entities/supermarket';
import FilterFindProducts from '../../domain/dtos/filter-find-products.dto';
import Product from '../../domain/entities/product';
import SalePrice from '../../domain/entities/sale-price';
import ProductRepository from '../../domain/repositories/product.repository';
import ProductModel from '../models/product.model';
import SalePriceModel from '../models/sale-price.model';

export default class ProductRepositoryDatabase implements ProductRepository {
  constructor(
    private readonly ormProductRepository: Repository<ProductModel>,
    private readonly ormSalePriceRepository: Repository<SalePriceModel>,
  ) {}

  async updateSalePrice(
    productId: number,
    supermarketId: number,
    salePrice: number,
  ): Promise<SalePrice> {
    const salePriceModel = await this.ormSalePriceRepository.findOne({
      where: {
        supermarket: {
          id: supermarketId,
        },
        product: {
          id: productId,
        },
      },
    });

    if (!salePrice) {
      throw new SalePriceNotFound();
    }

    const salePriceUpdatedModel = await this.ormSalePriceRepository.save({
      ...salePriceModel,
      salePrice: salePrice,
    });

    return new SalePrice(
      new Supermarket(
        salePriceUpdatedModel.supermarket.id,
        salePriceUpdatedModel.supermarket.description,
      ),
      salePriceUpdatedModel.product.id,
      salePriceUpdatedModel.salePrice,
    );
  }

  async deleteSalePrice(
    productId: number,
    supermarketId: number,
  ): Promise<void> {
    const salePrice = await this.ormSalePriceRepository.findOne({
      where: {
        supermarket: {
          id: supermarketId,
        },
        product: {
          id: productId,
        },
      },
    });

    if (!salePrice) {
      throw new SalePriceNotFound();
    }

    await this.ormSalePriceRepository.delete({
      id: salePrice.id,
    });
  }

  async delete(productId: number): Promise<void> {
    const product = await this.ormProductRepository.findOneBy({
      id: productId,
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    await this.ormProductRepository.delete({
      id: product.id,
    });
  }

  async findProductSalesPrices(
    productId: number,
  ): Promise<[Product, SalePrice[]]> {
    const productModel = await this.ormProductRepository.findOne({
      where: { id: productId },
    });

    if (!productModel) {
      throw new ProductNotFoundError();
    }

    const salePriceModels = await this.ormSalePriceRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      relations: ['product', 'supermarket'],
    });

    const product: Product = new Product(
      productModel.id,
      productModel.description,
      productModel.cost,
      productModel.image,
    );

    const salesPrices: SalePrice[] = salePriceModels.map(
      (model) =>
        new SalePrice(
          new Supermarket(model.supermarket.id, model.supermarket.description),
          model.product.id,
          model.salePrice,
        ),
    );

    return [product, salesPrices];
  }

  async saveSalePrice(salePrice: SalePrice): Promise<SalePrice> {
    const productModel = await this.ormProductRepository.findOne({
      where: {
        id: salePrice.productId,
      },
    });

    if (!productModel) {
      throw new ProductNotFoundError();
    }

    const salePriceFinded = await this.ormSalePriceRepository.findOne({
      where: {
        supermarket: {
          id: salePrice.supermarket.id,
        },
        product: {
          id: salePrice.productId,
        },
      },
    });

    if (salePriceFinded) {
      throw new SalePriceAlreadyExistsError();
    }

    const salePriceModel = await this.ormSalePriceRepository.save({
      product: productModel,
      supermarket: salePrice.supermarket,
      salePrice: salePrice.salePrice,
    });

    return new SalePrice(
      salePrice.supermarket,
      salePriceModel.product.id,
      salePriceModel.salePrice,
    );
  }

  async save(product: Product): Promise<Product> {
    const modelCreated = await this.ormProductRepository.save({
      id: product.id != 0 ? product.id : null,
      description: product.description,
      cost: product.cost,
      image: product.image,
    });

    return new Product(
      modelCreated.id,
      modelCreated.description,
      modelCreated.cost,
      modelCreated.image,
    );
  }

  async findAndCount(filter: FilterFindProducts): Promise<[Product[], number]> {
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
      skip: (filter.page - 1) * filter.perPage,
      take: filter.perPage,
    });

    const products: Product[] = models.map(
      (model) =>
        new Product(model.id, model.description, model.cost, model.image),
    );

    return [products, total];
  }
}
