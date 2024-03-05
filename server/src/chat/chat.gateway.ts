import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import MongoStore from 'connect-mongo';
import { ConfigService } from '@nestjs/config';
import { IEnv } from 'src/configs/env.config';
import { Server, Socket } from 'socket.io';
import { GroupService } from '../group/group.service';
import { GroupChatService } from './group-chat.service';
import { MessageDto } from './dto/message.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { GetMessagesDto } from './dto/getMessages.dto';

@WebSocketGateway({})
@UsePipes(
  new ValidationPipe({
    exceptionFactory(validationErrors = []) {
      if (this.isDetailedOutputDisabled) return new WsException('Bad request');
      const errors = this.flattenValidationErrors(validationErrors);
      return new WsException(errors);
    },
  }),
)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  store: MongoStore;
  constructor(
    private readonly configService: ConfigService<IEnv>,
    private readonly groupService: GroupService,
    private readonly chatService: GroupChatService,
  ) {
    this.store = MongoStore.create({
      mongoUrl: configService.get('MONGO_URL'),
    });
  }
  handleConnection(socket: Socket) {
    const sid = socket.handshake.auth.sessionId
      .slice(4, socket.handshake.auth.sessionId.length)
      .split('.')[0];
    this.store.get(sid, (err, session) => {
      if (err || !session) {
        console.log(err);
        console.log(session);
        socket.disconnect(true);
        return;
      }
      this.initSocket(socket, session.passport.user.id);
    });
  }
  private async initSocket(socket: Socket, userId: string) {
    const groups = await this.groupService.findGroupsByMember(userId);
    const groupIds = groups.map((el) => el.id);
    await socket.join([...groupIds, userId]);
    socket.data.userId = userId;
    socket.data.groups = groupIds;
    await socket.emit('auth');
  }
  @SubscribeMessage('message')
  async handleMessage(socket: Socket, messageDto: MessageDto) {
    const userId = socket.data.userId;
    const msg = await this.chatService.sendMessage(
      messageDto.groupId,
      userId,
      messageDto.message,
    );
    this.server.to(socket.data.groups).emit('message', msg);
  }
  @SubscribeMessage('get-messages')
  async getMessages(socket: Socket, getMessagesDto: GetMessagesDto) {
    const userId = socket.data.userId;
    const msgs = await this.chatService.getMessages(
      getMessagesDto.chatId,
      userId,
      getMessagesDto.from,
    );
    socket.emit('get-messages', msgs);
  }
}
