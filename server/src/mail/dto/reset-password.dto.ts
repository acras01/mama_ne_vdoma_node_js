import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { PasswordDto } from 'src/shared/dto/password.dto';

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
