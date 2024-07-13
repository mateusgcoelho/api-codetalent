import { HttpStatus } from '@nestjs/common';

type OutputResponse = {
  timestamp?: string;
  statusCode: HttpStatus;
  path?: string;
  errorCode?: number;
  message?: string;
  data?: any;
};

export class HttpPresenter {
  static handle(props: OutputResponse): OutputResponse {
    return {
      path: props.path,
      timestamp: new Date().toISOString(),
      statusCode: props.statusCode,
      errorCode: props.errorCode,
      data: props.data,
      message: props.message,
    };
  }
}
