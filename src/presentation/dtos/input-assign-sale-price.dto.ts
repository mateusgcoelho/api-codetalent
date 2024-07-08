import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';

export default class InputAssignSalePrice {
  @IsNumberString()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  shopId: number;

  @IsNumberString()
  salePrice: number;
}
