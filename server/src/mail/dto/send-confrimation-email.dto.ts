import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';

export class SendConfirmationEmail {
  @ApiProperty()
  @IsEmailCustom()
  email: string;

  @ApiProperty()
  @IsStringCustom()
  code: string;
}
