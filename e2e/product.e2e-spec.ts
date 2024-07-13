import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpResponseInterceptor } from '../src/core/presentation/interceptors/http-response.interceptor';

import { NestExpressApplication } from '@nestjs/platform-express';
import { ProductModule } from '@product/presentation/product.module';
import { DataSource } from 'typeorm';

import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

jest.useRealTimers();

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
    const supermarket = await dataSource.getRepository(SupermarketModel).save({
      id: 1,
      description: 'LOJA',
    });
    const product = await dataSource.getRepository(ProductModel).save({
      id: 1,
      description: 'COSTELA KG',
      cost: 24.4,
      image: null,
    });
    await dataSource.getRepository(SalePriceModel).save({
      product,
      supermarket,
      salePrice: 55.6,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ProductModule],
      providers: [Logger],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalInterceptors(new HttpResponseInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST - /api/v1/products', () => {
    it(`
      Given a request to create a new product
      when product created with success in database
      then should be return it
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send({
          description: 'TESTE DE PRODUTO',
          cost: 567.89,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);

      expect(response.body).toStrictEqual({
        statusCode: 201,
        data: {
          product: {
            id: 2,
            description: 'TESTE DE PRODUTO',
            cost: 567.89,
            image: null,
          },
        },
      });
    });
  });

  describe('GET - /api/v1/products', () => {
    it(`
      Given a request to find products
      when the database search is successful
      then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .query({
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        data: {
          products: [
            {
              id: 1,
              description: 'COSTELA KG',
              cost: 24.4,
              image: null,
            },
            {
              id: 2,
              description: 'TESTE DE PRODUTO',
              cost: 567.89,
              image: null,
            },
          ],
          total: 2,
          maxPage: 1,
        },
      });
    });
  });

  describe('GET - /api/v1/products/:id', () => {
    it(`
      Given a request to find a specific product
      when the database search is successful
      then you should return product and yours sales prices
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/products/1')
        .query({
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        data: {
          product: {
            id: 1,
            description: 'COSTELA KG',
            cost: 24.4,
            image: null,
          },
          salesPrices: [
            {
              productId: 1,
              salePrice: '55.600',
              supermarket: {
                description: 'LOJA',
                id: 1,
              },
            },
          ],
        },
      });
    });
  });
});
