import { CodeErrorEnum } from '@core/domain/enums/code-error.enum';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpPresenter } from '../presenters/http.presenter';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = error.getStatus();

    return response.status(statusCode).json(
      HttpPresenter.handle({
        statusCode,
        path: request.url,
        errorCode: CodeErrorEnum.UNMAPPED_ERROR,
        message: 'Ocorreu um erro inesperado ao acessar recurso!',
      }),
    );
  }
}
