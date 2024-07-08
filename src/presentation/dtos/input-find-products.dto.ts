import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export default class InputFindProducts {
  @IsNumberString()
  @IsOptional()
  productId?: number;

  @IsString()
  @MaxLength(60)
  @IsOptional()
  description?: string;

  @IsNumberString()
  @IsOptional()
  cost?: number;

  @IsNumber()
  @IsOptional()
  price?: number;
}
