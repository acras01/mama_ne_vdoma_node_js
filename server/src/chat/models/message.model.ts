import { index, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@index({ createdAt: 1 }) // compound index
export class MessageModel extends TimeStamps {
  @prop()
  userId: string;
  @prop()
  chatId: string;
  @prop()
  message: string;
}
