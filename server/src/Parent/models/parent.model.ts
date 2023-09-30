import { index, prop } from '@typegoose/typegoose';
import { ValidateNested } from 'class-validator';
import { Child } from 'src/Childs/models/child.model';

export class Location {
  @prop()
  type: string;

  @prop({ required: true })
  coordinates: [number];
}

@index({ location: '2dsphere' })
export class Parent {
  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: false, select: false })
  password?: string;

  @prop({ required: false })
  name?: string;

  @prop({ required: false })
  avatar?: string;

  @prop({ required: false })
  phone: string;

  @ValidateNested({ each: true })
  @prop({ _id: false, required: false, type: () => [Location] })
  location?: Location;

  @prop({ required: false })
  childs?: Child[];

  @prop({ required: false, select: false })
  activationCode?: string;

  @prop({ required: false })
  isConfirmed: boolean;
}
