import { Logger, Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import AssignSalePriceProductUseCase from '@product/application/use-cases/assign-sale-price-product.use-case';
import CreateProductUseCase from '@product/application/use-cases/create-product.use-case';
import DeleteProductUseCase from '@product/application/use-cases/delete-product.use-case';
import DeleteSalePriceUseCase from '@product/application/use-cases/delete-sale-price.use-case';
import FindProductsUseCase from '@product/application/use-cases/find-products.use-case';
import GetProductUseCase from '@product/application/use-cases/get-product.use-case';
import UpdateProductUseCase from '@product/application/use-cases/update-product.use-case';
import UpdateSalePriceUseCase from '@product/application/use-cases/update-sale-price.use-case';
import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import ProductRepositoryDatabase from '@product/infra/repositories/product-database.repository';
import SupermarketRepositoryDatabase from '@supermarket/infra/repositories/supermarket-database.repository';

import { Repository } from 'typeorm';

export default class ProductProvider {
  private static get infra(): Provider[] {
    return [
      {
        provide: ProductRepositoryDatabase,
        useFactory: (
          repositoryProduct: Repository<ProductModel>,
          repositorySalePrice: Repository<SalePriceModel>,
        ) => {
          return new ProductRepositoryDatabase(
            repositoryProduct,
            repositorySalePrice,
          );
        },
        inject: [
          getRepositoryToken(ProductModel),
          getRepositoryToken(SalePriceModel),
        ],
      },
      {
        provide: SupermarketRepositoryDatabase,
        useFactory: (repository: Repository<SupermarketModel>) => {
          return new SupermarketRepositoryDatabase(repository);
        },
        inject: [getRepositoryToken(SupermarketModel)],
      },
    ];
  }

  private static get application(): Provider[] {
    return [
      {
        provide: UpdateSalePriceUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new UpdateSalePriceUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: UpdateProductUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new UpdateProductUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: DeleteSalePriceUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new DeleteSalePriceUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: DeleteProductUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new DeleteProductUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: FindProductsUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new FindProductsUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: GetProductUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new GetProductUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: CreateProductUseCase,
        useFactory: (productRepository: ProductRepositoryDatabase) => {
          return new CreateProductUseCase(productRepository);
        },
        inject: [ProductRepositoryDatabase],
      },
      {
        provide: AssignSalePriceProductUseCase,
        useFactory: (
          productRepository: ProductRepositoryDatabase,
          supermarketRepository: SupermarketRepositoryDatabase,
        ) => {
          return new AssignSalePriceProductUseCase(
            productRepository,
            supermarketRepository,
          );
        },
        inject: [ProductRepositoryDatabase, SupermarketRepositoryDatabase],
      },
    ];
  }

  private static get presentation(): Provider[] {
    return [Logger];
  }

  static get values(): Provider[] {
    return [...this.infra, ...this.application, ...this.presentation];
  }
}
