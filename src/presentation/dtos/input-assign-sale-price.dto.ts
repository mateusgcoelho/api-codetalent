import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export default class InputAssignSalePrice {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  shopId: number;

  @IsNumber()
  salePrice: number;
}
