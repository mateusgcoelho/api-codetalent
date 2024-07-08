import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import ProductModel from './product.model';
import ShopModel from './shop.model';

@Entity({ schema: 'public', name: 'produtoloja' })
export default class SalePriceModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ShopModel)
  shop: ShopModel;

  @ManyToOne(() => ProductModel)
  product: ProductModel;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 3,
    name: 'precoVenda',
  })
  salePrice: number;
}
