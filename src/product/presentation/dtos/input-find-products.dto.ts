import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export default class InputFindProducts {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  productId?: number;

  @IsString()
  @MaxLength(60)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  cost?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  perPage: number;
}
