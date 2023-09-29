import { prop } from '@typegoose/typegoose';
import { Parent } from 'src/Parent/models/parent.model';

export class Child {
  @prop({ required: true })
  age: number;

  @prop({ required: true })
  parent: Parent;
}
