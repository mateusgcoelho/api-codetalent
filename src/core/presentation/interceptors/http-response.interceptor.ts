import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpPresenter } from '../presenters/http.presenter';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((returned) =>
        HttpPresenter.handle({
          statusCode: request.res.statusCode,
          data: returned,
          path: request.url,
        }),
      ),
    );
  }
}
