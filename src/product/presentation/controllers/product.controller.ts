import { HttpExceptionFilter } from '@core/presentation/filters/http-exception.filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import AssignSalePriceProductUseCase from '@product/application/use-cases/assign-sale-price-product.use-case';
import CreateProductUseCase from '@product/application/use-cases/create-product.use-case';
import DeleteProductUseCase from '@product/application/use-cases/delete-product.use-case';
import DeleteSalePriceUseCase from '@product/application/use-cases/delete-sale-price.use-case';
import FindProductsUseCase from '@product/application/use-cases/find-products.use-case';
import GetProductUseCase from '@product/application/use-cases/get-product.use-case';
import UpdateProductUseCase from '@product/application/use-cases/update-product.use-case';
import UpdateSalePriceUseCase from '@product/application/use-cases/update-sale-price.use-case';
import InputAssignSalePrice from '../dtos/input-assign-sale-price.dto';
import InputCreateProduct from '../dtos/input-create-product.dto';
import InputFindProducts from '../dtos/input-find-products.dto';
import InputUpdateProduct from '../dtos/input-update-product';

@Controller('products')
export default class ProductController {
  constructor(
    private readonly findProductsUseCase: FindProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly creteProductUseCase: CreateProductUseCase,
    private readonly assignSalePriceProductUseCase: AssignSalePriceProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly deleteSalePriceUseCase: DeleteSalePriceUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly updateSalePriceUseCase: UpdateSalePriceUseCase,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('id') productId: number) {
    return await this.getProductUseCase.execute({ productId });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findProducts(@Query() input: InputFindProducts) {
    return await this.findProductsUseCase.execute(input);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() input: InputCreateProduct, @UploadedFile() file) {
    return await this.creteProductUseCase.execute({
      ...input,
      image: file?.buffer,
    });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id') productId: number,
    @Body() input: InputUpdateProduct,
    @UploadedFile() file,
  ) {
    return await this.updateProductUseCase.execute({
      ...input,
      productId: productId,
      image: file?.buffer,
    });
  }

  @Post(':id/sale-price/:supermarketId')
  @HttpCode(HttpStatus.CREATED)
  async assignSalePrice(
    @Param('id') productId: number,
    @Param('supermarketId') supermarketId: number,
    @Body() input: InputAssignSalePrice,
  ) {
    return await this.assignSalePriceProductUseCase.execute({
      ...input,
      productId: productId,
      supermarketId: supermarketId,
    });
  }

  @Put(':id/sale-price/:supermarketId')
  async updateSalePrice(
    @Param('id') productId: number,
    @Param('supermarketId') supermarketId: number,
    @Body() input: InputAssignSalePrice,
  ) {
    return await this.updateSalePriceUseCase.execute({
      ...input,
      productId: productId,
      supermarketId: supermarketId,
    });
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  async deleteProduct(@Param('id') productId: number) {
    return await this.deleteProductUseCase.execute({
      productId: productId,
    });
  }

  @Delete(':id/sale-price/:supermarketId')
  @UseFilters(new HttpExceptionFilter())
  async deleteSalePrice(
    @Param('id') productId: number,
    @Param('supermarketId') supermarketId: number,
  ) {
    return await this.deleteSalePriceUseCase.execute({
      productId,
      supermarketId,
    });
  }
}
