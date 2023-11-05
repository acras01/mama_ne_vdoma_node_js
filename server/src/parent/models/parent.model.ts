import { index, prop } from '@typegoose/typegoose';
import { ValidateNested } from 'class-validator';
import { Location } from '../../shared/models/location.model';

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

  @prop({ required: false })
  countryCode: string;

  @ValidateNested({ each: true })
  @prop({ _id: false, required: false, type: () => [Location] })
  location?: Location;

  @prop({ default: false })
  isGoogle: boolean;

  @prop({ required: false, select: false })
  activationCode?: string;

  @prop({ required: false, select: false })
  passwordResetCode?: string;

  @prop({ required: false, select: false })
  passwordResetCodeExpire?: Date;

  @prop({ required: true, default: true, select: true })
  sendingEmails: boolean;

  @prop({ required: false, select: false })
  newEmail?: string;

  @prop({ required: false, select: false })
  changeEmailCode?: string;

  @prop({ required: false, select: false })
  changeEmailCodeExpire?: Date;

  @prop({ required: false })
  isConfirmed: boolean;

  @prop({ default: [] })
  groupJoinRequests: IGroupJoinRequest[];

  // TODO fix
  @prop({ required: false })
  week: unknown;

  @prop({requried:false})
  deviceId:string
}

export class IGroupJoinRequest {
  @prop({ required: true })
  groupId: string;

  @prop({ required: true })
  childId: string;
}
