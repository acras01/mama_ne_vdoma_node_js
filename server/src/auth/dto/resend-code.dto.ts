import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyEmailCustom } from 'src/decorators/isNotEmptyEmailCustom';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class ResendCodeDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsStringCustom()
  @IsNotEmptyEmailCustom()
  email: string;
}
