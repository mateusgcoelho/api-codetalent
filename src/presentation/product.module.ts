import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssignSalePriceProductUseCase from 'src/application/use-cases/assign-sale-price-product.use-case';
import CreateProductUseCase from 'src/application/use-cases/create-product.use-case';
import FindProductsUseCase from 'src/application/use-cases/find-products.use-case';
import ProductModel from 'src/infra/models/product.model';
import SalePriceModel from 'src/infra/models/sale-price.model';
import ShopModel from 'src/infra/models/shop.model';
import ProductRepositoryDatabase from 'src/infra/repositories/product-database.repository';
import ProductController from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductModel, ShopModel, SalePriceModel]),
  ],
  providers: [
    Logger,
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryDatabase,
    },
    FindProductsUseCase,
    CreateProductUseCase,
    AssignSalePriceProductUseCase,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
