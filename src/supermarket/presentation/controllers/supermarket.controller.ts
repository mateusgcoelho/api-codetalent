import { Controller, Get } from '@nestjs/common';
import FindSupermarketsUseCase from '@supermarket/application/use-cases/find-supermarkets.use-case';

@Controller('supermarkets')
export default class SupermarketController {
  constructor(
    private readonly findSupermarketsUseCase: FindSupermarketsUseCase,
  ) {}

  @Get()
  async findSupermarkets() {
    return await this.findSupermarketsUseCase.execute();
  }
}
