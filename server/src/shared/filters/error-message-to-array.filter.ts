import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

interface IJsonResp {
  statusCode: number;
  message: any;
  error: any;
}

@Catch(HttpException)
export class ErrorMessageToArrayFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResp = exception.getResponse();
    const json: IJsonResp = {
      statusCode: exception.getStatus(),
      message: [],
      error: '',
    };
    if (typeof exceptionResp === 'string') {
      json.error = exceptionResp;
      json.message = exceptionResp;
    } else {
      json.error = exceptionResp['error'];
      json.message = Array.isArray(exceptionResp['message'])
        ? exceptionResp['message']
        : [exceptionResp['message']];
    }
    response.status(exception.getStatus()).json(json);
  }
}
