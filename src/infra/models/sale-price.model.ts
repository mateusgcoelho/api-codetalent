import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductModel from './product.model';
import ShopModel from './shop.model';

@Entity({ schema: 'public', name: 'produtoloja' })
export default class SalePriceModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ShopModel)
  @JoinColumn({
    name: 'idloja',
    referencedColumnName: 'id',
  })
  shop: ShopModel;

  @ManyToOne(() => ProductModel)
  @JoinColumn({
    name: 'idproduto',
    referencedColumnName: 'id',
  })
  product: ProductModel;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 3,
    name: 'precovenda',
  })
  salePrice: number;
}
