import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
