import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import CreateProductUseCase from 'src/application/use-cases/create-product.use-case';
import FindProductsUseCase from 'src/application/use-cases/find-products.use-case';
import InputCreateProduct from '../dtos/input-create-product.dto';
import InputFindProducts from '../dtos/input-find-products.dto';

@Controller('products')
export default class ProductController {
  constructor(
    private readonly findProductsUseCase: FindProductsUseCase,
    private readonly creteProductUseCase: CreateProductUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findProducts(@Query() input: InputFindProducts) {
    return await this.findProductsUseCase.execute(input);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() input: InputCreateProduct) {
    return await this.creteProductUseCase.execute(input);
  }
}
