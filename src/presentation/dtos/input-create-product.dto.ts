import {
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export default class InputCreateProduct {
  @IsString()
  @MaxLength(60)
  description: string;

  @IsNumberString()
  @IsOptional()
  cost?: number;
}
