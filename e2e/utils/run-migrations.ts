import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import { DataSource } from 'typeorm';

export async function runMigrations(dataSource: DataSource) {
  const supermarket = await dataSource.getRepository(SupermarketModel).save({
    id: 1,
    description: 'LOJA',
  });
  const product = await dataSource.getRepository(ProductModel).save({
    id: 1,
    description: 'COSTELA KG',
    cost: 24.4,
    image: null,
  });
  await dataSource.getRepository(SalePriceModel).save({
    product,
    supermarket,
    salePrice: 55.6,
  });
}
