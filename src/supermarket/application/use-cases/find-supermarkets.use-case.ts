import SupermarketRepository from '@supermarket/domain/repositories/supermarket.repository';
import SupermarketDto from '../dtos/supermarket.dto';

type OutputFindSupermarkets = {
  supermarkets: SupermarketDto[];
};

export default class FindSupermarketsUseCase {
  constructor(private readonly supermarketRepository: SupermarketRepository) {}

  async execute(): Promise<OutputFindSupermarkets> {
    const supermarkets = await this.supermarketRepository.findAll();

    return {
      supermarkets: supermarkets.map((entity) =>
        SupermarketDto.fromEntity(entity),
      ),
    };
  }
}
