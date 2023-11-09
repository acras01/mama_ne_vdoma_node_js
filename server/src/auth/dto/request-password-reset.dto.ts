import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyEmailCustom } from 'src/decorators/isNotEmptyEmailCustom';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class RequestPasswordResetDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  @IsStringCustom()
  email: string;
}
