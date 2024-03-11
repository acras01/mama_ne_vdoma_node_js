import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient<Socket>();
    try {
      if (exception instanceof WsException) {
        socket.emit('exception', exception.getError());
      } else {
        socket.emit('exception', [exception.response.message]);
      }
    } catch (error) {
      console.log('error');
      console.error(error);
      socket.emit('exception', ['Server error']);
    }
  }
}
