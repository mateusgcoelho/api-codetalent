import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import AssignSalePriceProductUseCase from 'src/application/use-cases/assign-sale-price-product.use-case';
import CreateProductUseCase from 'src/application/use-cases/create-product.use-case';
import FindProductsUseCase from 'src/application/use-cases/find-products.use-case';
import InputAssignSalePrice from '../dtos/input-assign-sale-price.dto';
import InputCreateProduct from '../dtos/input-create-product.dto';
import InputFindProducts from '../dtos/input-find-products.dto';

@Controller('products')
export default class ProductController {
  constructor(
    private readonly findProductsUseCase: FindProductsUseCase,
    private readonly creteProductUseCase: CreateProductUseCase,
    private readonly assignSalePriceProductUseCase: AssignSalePriceProductUseCase,
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

  @Post(':id/assign-sale-price')
  @HttpCode(HttpStatus.CREATED)
  async assignSalePrice(
    @Param('id') productId: number,
    @Body() input: InputAssignSalePrice,
  ) {
    return await this.assignSalePriceProductUseCase.execute({
      productId: productId,
      ...input,
    });
  }
}
