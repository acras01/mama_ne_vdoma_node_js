import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from '../../decorators/isEmailCustom';
import { IsStringCustom } from '../../decorators/isStringCustom';
import { IsNotEmptyEmailCustom } from '../../decorators/IsNotEmptyEmailCustom';

export class ResendCodeDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsStringCustom()
  @IsNotEmptyEmailCustom()
  email: string;
}
