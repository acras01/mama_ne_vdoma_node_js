import { prop } from '@typegoose/typegoose';

export class Child {
  @prop({ required: true })
  name: string;
  @prop({ required: true })
  age: number;

  @prop({ required: true })
  isMale: boolean;

  @prop({ required: false, default: '' })
  note: string;

  @prop({ required: true })
  parentId: string;

  @prop({ required: false })
  week: unknown;
}
