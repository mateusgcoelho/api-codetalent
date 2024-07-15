import { DomainErrorFilter } from '@core/presentation/filters/domain-error.filter';
import { HttpExceptionFilter } from '@core/presentation/filters/http-exception.filter';
import { HttpResponseInterceptor } from '@core/presentation/interceptors/http-response.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';

export default class AppPresenter {
  static configureApp(app: INestApplication) {
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
}
