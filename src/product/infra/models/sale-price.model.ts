import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductModel from './product.model';
import SupermarketModel from './supermarket.model';

@Entity({ schema: 'public', name: 'produtoloja' })
export default class SalePriceModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => SupermarketModel)
  @JoinColumn({
    name: 'idloja',
    referencedColumnName: 'id',
  })
  supermarket: SupermarketModel;

  @ManyToOne(() => ProductModel, {
    onDelete: 'CASCADE',
  })
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
