import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import ProductController from './controllers/product.controller';
import ProductProvider from './product.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductModel, SupermarketModel, SalePriceModel]),
  ],
  providers: [...ProductProvider.values],
  controllers: [ProductController],
})
export class ProductModule {}
