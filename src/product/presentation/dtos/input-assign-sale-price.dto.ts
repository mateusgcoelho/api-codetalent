import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class InputAssignSalePrice {
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  salePrice: number;
}
