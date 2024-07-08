import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const httpPort = configService.get<number>('PORT') ?? 3000;
  await app.listen(httpPort);

  const urlApplication = await app.getUrl();
  logger.log(
    `Http service is running on: ${urlApplication}`,
    'MainApplication',
  );
}
bootstrap();
