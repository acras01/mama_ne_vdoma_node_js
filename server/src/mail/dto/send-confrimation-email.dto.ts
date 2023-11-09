import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class SendConfirmationEmail {
  @ApiProperty()
  @IsEmailCustom()
  email: string;

  @ApiProperty()
  @IsStringCustom()
  code: string;
}
