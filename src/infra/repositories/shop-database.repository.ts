import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Shop from 'src/domain/entities/shop';
import ShopRepository from 'src/domain/repositories/shop.repository';
import { Repository } from 'typeorm';
import ShopModel from '../models/shop.model';

@Injectable()
export default class ShopRepositoryDatabase implements ShopRepository {
  constructor(
    @InjectRepository(ShopModel)
    private readonly ormRepository: Repository<ShopModel>,
  ) {}

  async get(shopId: number): Promise<Shop | null> {
    return await this.ormRepository.findOne({
      where: {
        id: shopId,
      },
    });
  }
}
