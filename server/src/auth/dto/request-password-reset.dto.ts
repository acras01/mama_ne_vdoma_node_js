import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from '../../decorators/isEmailCustom';
import { IsNotEmptyEmailCustom } from '../../decorators/IsNotEmptyEmailCustom';
import { IsStringCustom } from '../../decorators/isStringCustom';


export class RequestPasswordResetDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  @IsStringCustom()
  email: string;
}
