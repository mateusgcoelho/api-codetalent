import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import SupermarketModel from '@product/infra/models/supermarket.model';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import AppPresenter from './app.presenter';
import SwaggerPresenter from './swagger/presentation/swagger.presenter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  AppPresenter.configureApp(app);
  SwaggerPresenter.configureSwagger(app);

  const dataSource = app.get(DataSource);
  await runMigrations(dataSource);

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const httpPort = configService.get<number>('SERVER_PORT') ?? 3000;
  await app.listen(httpPort);

  const urlApplication = await app.getUrl();
  logger.log(
    `Http service is running on: ${urlApplication}`,
    'MainApplication',
  );
}
bootstrap();

async function runMigrations(dataSource: DataSource) {
  await dataSource.runMigrations({
    transaction: 'all',
  });

  // Seeder temporario
  await dataSource.getRepository(SupermarketModel).save([
    {
      id: 1,
      description: 'LOJA PARAIBA',
    },
    {
      id: 2,
      description: 'LOJA LIMEIRA',
    },
    {
      id: 3,
      description: 'LOJA CAMPINAS',
    },
    {
      id: 4,
      description: 'LOJA PIRACICABA',
    },
  ]);
}
