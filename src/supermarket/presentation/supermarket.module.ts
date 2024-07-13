import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SupermarketModel from '@product/infra/models/supermarket.model';
import SupermarketController from './controllers/supermarket.controller';
import SupermarketProvider from './supermarket.provider';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketModel])],
  providers: [...SupermarketProvider.values],
  controllers: [SupermarketController],
})
export class SupermarketModule {}
