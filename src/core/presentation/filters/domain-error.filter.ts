import { CodeErrorEnum } from '@core/domain/enums/code-error.enum';
import DomainError from '@core/domain/errors/domain.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { HttpPresenter } from '../presenters/http.presenter';

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = CodeErrorEnum.getStatusCode(error.codeError);

    return response.status(statusCode).json(
      HttpPresenter.handle({
        statusCode,
        path: request.url,
        errorCode: error.codeError,
        message: error.message,
      }),
    );
  }
}
