import 'reflect-metadata';

import { DomainErrorFilter } from '@core/presentation/filters/domain-error.filter';
import { HttpExceptionFilter } from '@core/presentation/filters/http-exception.filter';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './core/presentation/interceptors/http-response.interceptor';
import SwaggerPresenter from './swagger/presentation/swagger.presenter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  SwaggerPresenter.configureSwagger(app);

  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();

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

function configureApp(app: INestApplication) {
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new DomainErrorFilter());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.enableCors();
}
