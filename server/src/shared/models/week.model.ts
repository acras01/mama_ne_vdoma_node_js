import { prop } from '@typegoose/typegoose';
import { DayDto } from '../dto/week.dto';

export class Week {
  @prop({ required: true })
  monday: DayDto;
  @prop({ required: true })
  tuesday: DayDto;
  @prop({ required: true })
  wednesday: DayDto;
  @prop({ required: true })
  thursday: DayDto;
  @prop({ required: true })
  friday: DayDto;
  @prop({ required: true })
  saturday: DayDto;
  @prop({ required: true })
  sunday: DayDto;
}

export class IDay {
  morning: boolean;
  lunch: boolean;
  evening: boolean;
}

export class IWeek {
  monday: IDay;
  tuesday: IDay;
  wednesday: IDay;
  thursday: IDay;
  friday: IDay;
  saturday: IDay;
  sunday: IDay;
}
