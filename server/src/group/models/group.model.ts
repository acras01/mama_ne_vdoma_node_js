import { index, prop } from '@typegoose/typegoose';
import { Location } from '../../shared/models/location.model';
import { ValidateNested } from 'class-validator';

@index({ location: '2dsphere' })
export class Group {
  @prop({ required: true })
  name: string;
  @prop({ required: true })
  desc: string;
  @prop({ required: true })
  adminId: string;
  @prop({ required: true })
  ages: string;
  @prop({ required: false })
  avatar?: string;
  @prop({ require: true, default: [] })
  members: askingJoinGroup[];
  @ValidateNested({ each: true })
  @prop({ _id: false, required: false, type: () => [Location] })
  location?: Location;
  @prop({ required: false })
  askingJoin?: askingJoinGroup[];
  // TODO fix
  @prop({ required: false })
  week?: unknown;

  @prop({ required: false })
  karma?: number;
}

export class askingJoinGroup {
  @prop({ required: true })
  parentId: string;

  @prop({ required: true })
  childId: string;
}
