import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class ConfirmEmailDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;
  @IsStringCustom()
  @ApiProperty()
  code: string;
}
