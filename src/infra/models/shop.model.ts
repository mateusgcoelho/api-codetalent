import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'loja' })
export default class ShopModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    length: 60,
    name: 'descricao',
  })
  description: string;
}
