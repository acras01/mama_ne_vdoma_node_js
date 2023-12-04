import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    console.log(req.body, 'b');
    console.log(req.path, 'p');
    console.log(req.query, 'q');
    console.log(req.params, 'params');
    if (req.path.includes('login') || req.path.includes('register')) return next.handle();

    const message = `HTTP Request url:${req.path}, query:${JSON.stringify(
      req.query,
    )}, params:${JSON.stringify(req.params)}, body:${JSON.stringify(
      req.body,
    )}, status:${res.statusCode}, `;

    return next.handle().pipe(
      tap(
        (responseBody) => {
          this.logger.log(message + `response: ${responseBody}`);
        },
        (err) => {
          this.logger.log(message + `error: ${err.response.message}`);
        },
      ),
    );
  }
}
