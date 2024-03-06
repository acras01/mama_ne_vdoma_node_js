import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
export class MessageDto {
  @IsNotEmptyCustom()
  @IsStringCustom()
  groupId: string;
  @IsNotEmptyCustom()
  @IsStringCustom()
  message: string;
}
