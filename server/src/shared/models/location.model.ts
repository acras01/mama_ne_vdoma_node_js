import { prop } from '@typegoose/typegoose';

export class Location {
  @prop()
  type: string;

  @prop({ required: true })
  coordinates: number[];
}
