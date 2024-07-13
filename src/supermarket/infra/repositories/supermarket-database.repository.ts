import { Repository } from 'typeorm';
import SupermarketModel from '../../../product/infra/models/supermarket.model';
import Supermarket from '../../domain/entities/supermarket';
import SupermarketNotFoundError from '../../domain/errors/supermarket-not-found.error';
import SupermarketRepository from '../../domain/repositories/supermarket.repository';

export default class SupermarketRepositoryDatabase
  implements SupermarketRepository
{
  constructor(private readonly ormRepository: Repository<SupermarketModel>) {}

  async findAll(): Promise<Supermarket[]> {
    const models = await this.ormRepository.find();

    return models.map((model) => new Supermarket(model.id, model.description));
  }

  async findOrThrow(supermarketId: number): Promise<Supermarket> {
    const model = await this.ormRepository.findOne({
      where: {
        id: supermarketId,
      },
    });

    if (!model) {
      throw new SupermarketNotFoundError();
    }

    return new Supermarket(model.id, model.description);
  }
}
