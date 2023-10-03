import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

interface IJsonResp {
  statusCode: number;
  message: any;
  error: any;
}

@Catch(Error.CastError)
export class MongoCastErrorFilter implements ExceptionFilter {
  catch(exception: Error.CastError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const json: IJsonResp = {
      statusCode: 404,
      message: [`${exception.value} is wrong format id`],
      error: 'Bad Request',
    };
    response.status(404).json(json);
  }
}
