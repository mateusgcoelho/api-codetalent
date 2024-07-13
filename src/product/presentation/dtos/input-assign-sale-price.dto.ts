import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class InputAssignSalePrice {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  supermarketId: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  salePrice: number;
}
