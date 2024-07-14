import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'reflect-metadata';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { ProductModule } from '@product/presentation/product.module';
import { DataSource } from 'typeorm';

import ProductModel from '@product/infra/models/product.model';
import SalePriceModel from '@product/infra/models/sale-price.model';
import SupermarketModel from '@product/infra/models/supermarket.model';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { configureApp } from './utils/configure-app';
import { runMigrations } from './utils/run-migrations';

jest.useRealTimers();

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dataSource = await getDataSource();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ProductModule],
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

  describe('POST - /api/v1/products', () => {
    it(`
      Given a request to create a new product,
      When product created with success in database,
      Then should be return it
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send({
          description: 'TESTE DE PRODUTO',
          cost: 567.89,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);

      expect(response.body).toStrictEqual({
        statusCode: 201,
        path: '/api/v1/products',
        timestamp: expect.anything(),
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

  describe('PUT - /api/v1/products/:id', () => {
    it(`
      Given a request to update a product,
      When product updated with success in database,
      Then should be return it
    `, async () => {
      const response = await request(app.getHttpServer())
        .put('/api/v1/products/2')
        .send({
          description: 'TESTE DE PRODUTO2',
          cost: 84,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        path: '/api/v1/products/2',
        timestamp: expect.anything(),
        data: {
          product: {
            id: 2,
            description: 'TESTE DE PRODUTO2',
            cost: 84,
            image: null,
          },
        },
      });
    });

    it(`
      Given a request to update a product,
      When product not exists in database,
      Then should be return a error
    `, async () => {
      const response = await request(app.getHttpServer())
        .put('/api/v1/products/2444')
        .send({
          description: 'TESTE DE PRODUTO2',
          cost: 84,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/2444',
        timestamp: expect.anything(),
        errorCode: 1,
        message: 'Não foi possível encontrar o produto.',
      });
    });
  });

  describe('PUT - /api/v1/products/:id/sale-price/:supermarketId', () => {
    it(`
      Given a request to update a sale price product,
      When sale price updated with success in database,
      Then should be return it
    `, async () => {
      const response = await request(app.getHttpServer())
        .put('/api/v1/products/1/sale-price/1')
        .send({
          salePrice: 55,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        path: '/api/v1/products/1/sale-price/1',
        timestamp: expect.anything(),
        data: {
          salePrice: {
            productId: 1,
            salePrice: 55,
            supermarket: {
              description: 'LOJA',
              id: 1,
            },
          },
        },
      });
    });

    it(`
      Given a request to update a sale price product,
      When shop not exists in database,
      Then should be return a error
    `, async () => {
      const response = await request(app.getHttpServer())
        .put('/api/v1/products/1/sale-price/55')
        .send({
          salePrice: 55,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/1/sale-price/55',
        timestamp: expect.anything(),
        errorCode: 7,
        message: 'Preço venda de produto para a loja não encontrado.',
      });
    });
  });

  describe('GET - /api/v1/products', () => {
    it(`
      Given a request to find products,
      When the database search is successful,
      Then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/products?page=1&perPage=10',
        timestamp: expect.anything(),
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
              description: 'TESTE DE PRODUTO2',
              cost: 84,
              image: null,
            },
          ],
          total: 2,
          maxPage: 1,
        },
      });
    });

    it(`
      Given a request to find products,
      When the database search with filter (salePrice) is successful,
      Then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({
          price: 55,
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/products?price=55&page=1&perPage=10',
        timestamp: expect.anything(),
        data: {
          products: [
            {
              id: 1,
              description: 'COSTELA KG',
              cost: 24.4,
              image: null,
            },
          ],
          total: 1,
          maxPage: 1,
        },
      });
    });

    it(`
      Given a request to find products,
      When the database search with filter (productId) is successful,
      Then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({
          productId: 2,
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/products?productId=2&page=1&perPage=10',
        timestamp: expect.anything(),
        data: {
          products: [
            {
              id: 2,
              description: 'TESTE DE PRODUTO2',
              cost: 84,
              image: null,
            },
          ],
          total: 1,
          maxPage: 1,
        },
      });
    });

    it(`
      Given a request to find products,
      When the database search with filter (description) is successful,
      Then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({
          description: 'TESTE',
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/products?description=TESTE&page=1&perPage=10',
        timestamp: expect.anything(),
        data: {
          products: [
            {
              id: 2,
              description: 'TESTE DE PRODUTO2',
              cost: 84,
              image: null,
            },
          ],
          total: 1,
          maxPage: 1,
        },
      });
    });

    it(`
      Given a request to find products,
      When the database search with filter (cost) is successful,
      Then you should return products
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .query({
          cost: 84,
          page: 1,
          perPage: 10,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        statusCode: 200,
        path: '/api/v1/products?cost=84&page=1&perPage=10',
        timestamp: expect.anything(),
        data: {
          products: [
            {
              id: 2,
              description: 'TESTE DE PRODUTO2',
              cost: 84,
              image: null,
            },
          ],
          total: 1,
          maxPage: 1,
        },
      });
    });
  });

  describe('GET - /api/v1/products/:id', () => {
    it(`
      Given a request to find a specific product,
      When the database search is successful,
      Then you should return product and yours sales prices
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products/1')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        path: '/api/v1/products/1',
        timestamp: expect.anything(),
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
              salePrice: 55,
              supermarket: {
                description: 'LOJA',
                id: 1,
              },
            },
          ],
        },
      });
    });

    it(`
      Given a request to find a specific product,
      When the database search is not found the product,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products/43')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/43',
        timestamp: expect.anything(),
        errorCode: 1,
        message: 'Não foi possível encontrar o produto.',
      });
    });
  });

  describe('POST - /api/v1/products/:id/sale-price/:supermarketId', () => {
    it(`
      Given the request to create the sales price of the product,
      When successfully created in the database,
      Then it must be possible to return created product information
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products/2/sale-price/1')
        .send({
          salePrice: 55.2,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);

      expect(response.body).toStrictEqual({
        statusCode: 201,
        path: '/api/v1/products/2/sale-price/1',
        timestamp: expect.anything(),
        data: {
          product: {
            id: 2,
            description: 'TESTE DE PRODUTO2',
            cost: 84,
            image: null,
          },
          salesPrices: [
            {
              productId: 2,
              salePrice: 55.2,
              supermarket: {
                description: 'LOJA',
                id: 1,
              },
            },
          ],
        },
      });
    });

    it(`
      Given the request to create the sales price of the product,
      When sale price already exists in the database,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products/1/sale-price/1')
        .send({
          salePrice: 55.2,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toStrictEqual({
        statusCode: 409,
        path: '/api/v1/products/1/sale-price/1',
        timestamp: expect.anything(),
        errorCode: 3,
        message: 'Preço venda de produto ja existe para a loja.',
      });
    });

    it(`
      Given the request to create the sales price of the product,
      When product not exists in the database,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products/14/sale-price/1')
        .send({
          salePrice: 55.2,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/14/sale-price/1',
        timestamp: expect.anything(),
        errorCode: 1,
        message: 'Não foi possível encontrar o produto.',
      });
    });

    it(`
      Given the request to create the sales price of the product,
      When supermarket not exists in the database,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/products/1/sale-price/441')
        .send({
          salePrice: 55.2,
        })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/1/sale-price/441',
        timestamp: expect.anything(),
        errorCode: 2,
        message: 'Não foi possível encontrar a loja.',
      });
    });
  });

  describe('DELETE - /api/v1/products/:id', () => {
    it(`
      Given the request to delete a product,
      When successfully deleted in the database,
      Then it must be possible to return success
    `, async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/products/2')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        path: '/api/v1/products/2',
        timestamp: expect.anything(),
      });
    });

    it(`
      Given the request to delete a product,
      When product not exists in the database,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/products/55')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/55',
        timestamp: expect.anything(),
        errorCode: 1,
        message: 'Não foi possível encontrar o produto.',
      });
    });
  });

  describe('DELETE - /api/v1/products/:id/sale-price/:supermarketId', () => {
    it(`
      Given the request to delete a sale product,
      When successfully deleted in the database,
      Then it must be possible to return success
    `, async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/products/1/sale-price/1')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.OK);

      expect(response.body).toStrictEqual({
        statusCode: 200,
        path: '/api/v1/products/1/sale-price/1',
        timestamp: expect.anything(),
      });
    });

    it(`
      Given the request to delete a sale product,
      When sale product not exists in the database,
      Then it must be possible to return error
    `, async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/v1/products/1/sale-price/1531')
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual({
        statusCode: 404,
        path: '/api/v1/products/1/sale-price/1531',
        timestamp: expect.anything(),
        errorCode: 7,
        message: 'Preço venda de produto para a loja não encontrado.',
      });
    });
  });
});
