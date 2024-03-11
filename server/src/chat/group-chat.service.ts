import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GroupService } from '../group/group.service';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { MessageModel } from './models/message.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { Group } from '../group/models/group.model';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly groupService: GroupService,
    @InjectModel(MessageModel)
    private readonly messageModel: ReturnModelType<typeof MessageModel>,
  ) {}

  async sendMessage(chatId, userId, message) {
    await this.checkBelongsToChat(chatId, userId);
    return await this.messageModel.create({ chatId, userId, message });
  }
  private async checkBelongsToChat(chatId, userId) {
    const group = await this.groupService.findById(chatId);
    if (!group.members.some((el) => el.parentId === userId)) {
      throw new UnauthorizedException('Нема доступу до цього чату');
    }
    return group;
  }
  async getMessages(chatId, userId, from?) {
    await this.checkBelongsToChat(chatId, userId);
    console.log(from);
    if (from) {
      return await this.messageModel
        .find({ $and: [{ chatId }, { createdAt: { $: from } }] })
        .sort({ createdAt: 'desc' })
        .limit(50);
    }
    return await this.messageModel
      .find({ chatId })
      .sort({ createdAt: 'desc' })
      .limit(50);
  }
}
