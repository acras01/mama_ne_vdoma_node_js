import { IsDate, IsDateString, IsOptional } from 'class-validator';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';

export class GetMessagesDto {
  @IsNotEmptyCustom()
  @IsStringCustom()
  chatId: string;
  @IsDateString()
  @IsNotEmptyCustom()
  @IsOptional()
  from?: Date;
}
