import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { GroupModule } from '../group/group.module';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { MessageModel } from './models/message.model';
import { GroupChatService } from './group-chat.service';

@Module({
  imports: [
    AuthModule,
    GroupModule,
    TypegooseModule.forFeature([MessageModel]),
  ],
  providers: [ChatGateway, GroupChatService],
})
export class ChatModule {}
