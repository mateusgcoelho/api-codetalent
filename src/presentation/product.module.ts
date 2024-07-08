import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CreateProductUseCase from 'src/application/use-cases/create-product.use-case';
import FindProductsUseCase from 'src/application/use-cases/find-products.use-case';
import ProductModel from 'src/infra/models/product.model';
import ProductRepositoryDatabase from 'src/infra/repositories/product-database.repository';
import ProductController from './controllers/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductModel])],
  providers: [
    Logger,
    {
      provide: 'ProductRepository',
      useClass: ProductRepositoryDatabase,
    },
    FindProductsUseCase,
    CreateProductUseCase,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
