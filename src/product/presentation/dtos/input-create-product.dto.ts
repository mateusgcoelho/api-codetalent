import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class InputCreateProduct {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  description: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  cost?: number;
}
