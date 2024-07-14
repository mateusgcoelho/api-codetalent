import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';

export default class SwaggerPresenter {
  static async configureSwagger(app: INestApplication) {
    const pathDocumentation = join(
      __dirname,
      '../../../..',
      '/swagger-docs.json',
    );
    const swaggerFile = readFileSync(pathDocumentation, 'utf-8');
    const options = JSON.parse(swaggerFile);

    SwaggerModule.setup('/api/docs', app, options);
  }
}
