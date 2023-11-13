import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyEmailCustom } from '../../decorators/IsNotEmptyEmailCustom';
import { IsStringCustom } from '../../decorators/isStringCustom';
import { IsEmailCustom } from '../../decorators/isEmailCustom';
import { PasswordDto } from '../../shared/dto/password.dto';

export class RegisterDto extends PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  email: string;
}
