import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import SalePriceModel from './sale-price.model';

@Entity({ schema: 'public', name: 'produto' })
export default class ProductModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 60,
    name: 'descricao',
  })
  description: string;

  @Column({
    type: 'numeric',
    precision: 13,
    scale: 3,
    name: 'custo',
  })
  cost?: number;

  @Column({ name: 'imagem', type: 'bytea', nullable: true })
  image?: Buffer;

  @OneToMany(() => SalePriceModel, (salePrice) => salePrice.product)
  salesPrices: SalePriceModel[];
}
