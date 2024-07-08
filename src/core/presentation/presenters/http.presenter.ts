import { HttpStatus } from '@nestjs/common';

interface OutputResponse {
  statusCode: HttpStatus;
  errorCode?: number;
  message?: string;
  data: any;
}

export class HttpPresenter {
  static handle(
    statusCode: HttpStatus,
    data: any,
    message?: string,
  ): OutputResponse {
    return {
      statusCode,
      data,
      message,
    };
  }
}
