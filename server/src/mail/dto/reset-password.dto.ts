import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';
import { PasswordDto } from '../../shared/dto/password.dto';

export class ResetPasswordDto extends PasswordDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsNotEmptyCustom()
  email: string;

  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  code: string;
}
