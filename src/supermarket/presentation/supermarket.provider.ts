import { Logger, Provider } from '@nestjs/common';
import SupermarketModel from '@product/infra/models/supermarket.model';
import FindSupermarketsUseCase from '@supermarket/application/use-cases/find-supermarkets.use-case';
import SupermarketRepositoryDatabase from '@supermarket/infra/repositories/supermarket-database.repository';

import { DataSource } from 'typeorm';

export default class SupermarketProvider {
  private static get infra(): Provider[] {
    return [
      {
        provide: SupermarketRepositoryDatabase,
        useFactory: (dataSource: DataSource) => {
          const repositorySupermarket =
            dataSource.getRepository(SupermarketModel);

          return new SupermarketRepositoryDatabase(repositorySupermarket);
        },
        inject: [DataSource],
      },
    ];
  }

  private static get application(): Provider[] {
    return [
      {
        provide: FindSupermarketsUseCase,
        useFactory: (supermarketRepository: SupermarketRepositoryDatabase) => {
          return new FindSupermarketsUseCase(supermarketRepository);
        },
        inject: [SupermarketRepositoryDatabase],
      },
    ];
  }

  private static get presentation(): Provider[] {
    return [Logger];
  }

  static get values(): Provider[] {
    return [...this.infra, ...this.application, ...this.presentation];
  }
}
