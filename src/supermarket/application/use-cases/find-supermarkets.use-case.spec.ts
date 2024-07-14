import Supermarket from '@supermarket/domain/entities/supermarket';
import SupermarketRepository from '@supermarket/domain/repositories/supermarket.repository';
import FindSupermarketsUseCase from './find-supermarkets.use-case';

describe('FindSupermarketsUseCase', () => {
  const mockSupermarket = new Supermarket(1, 'LOJA');

  let SupermarketRepository: jest.Mocked<SupermarketRepository>;
  let findSupermarkets: FindSupermarketsUseCase;

  beforeEach(async () => {
    SupermarketRepository = {
      findOrThrow: jest.fn(),
      findAll: jest.fn().mockResolvedValue([mockSupermarket]),
    };

    findSupermarkets = new FindSupermarketsUseCase(SupermarketRepository);
  });

  test(`
    Given supermarkets in the database,
    When retrieving all supermarkets,
    Then all supermarkets should be returned
  `, async function () {
    const outputFindSupermarkets = await findSupermarkets.execute();

    expect(outputFindSupermarkets.supermarkets.length).toEqual(1);
    expect(outputFindSupermarkets).toEqual({
      supermarkets: [
        {
          id: 1,
          description: 'LOJA',
        },
      ],
    });
  });
});
