import { prop } from '@typegoose/typegoose';

export class Karma {
  @prop({ required: true })
  fromId: string;

  @prop({ required: true })
  toId: string;

  @prop({ required: true })
  rate: number;
}
