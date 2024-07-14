import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';

import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import { SupermarketModule } from '@supermarket/presentation/supermarket.module';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { configureApp } from './utils/configure-app';
import { runMigrations } from './utils/run-migrations';

jest.useRealTimers();

describe('Supermarket (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dataSource = await getDataSource();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, SupermarketModule],
      providers: [Logger],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = module.createNestApplication<NestExpressApplication>();
    configureApp(app);

    await app.init();
  });

  async function getDataSource(): Promise<DataSource> {
    const container = await new PostgreSqlContainer('postgres')
      .withExposedPorts(5432)
      .withDatabase('nest')
      .withUsername('root')
      .withPassword('secret')
      .withNetworkMode('bridge')
      .start();

    const dataSource = new DataSource({
      type: 'postgres',
      name: container.getDatabase(),
      username: container.getUsername(),
      password: container.getPassword(),
      port: container.getPort(),
      host: container.getHost(),
      database: container.getDatabase(),
      synchronize: true,
      migrationsRun: true,
      entities: [ProductModel, SalePriceModel, SupermarketModel],
    });

    await dataSource.initialize();
    await dataSource.runMigrations();
    await runMigrations(dataSource);

    return dataSource;
  }

  afterAll(async () => {
    await app.close();
  });

  describe('GET - /api/v1/supermarkets', () => {
    it(`
      Given a request to find supermarkets,
      When the database search is successful,
      Then you should return supermarkets
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/supermarkets')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/supermarkets',
        timestamp: expect.anything(),
        data: {
          supermarkets: [
            {
              id: 1,
              description: 'LOJA',
            },
          ],
        },
      });
    });
  });
});
