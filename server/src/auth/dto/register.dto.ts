import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyEmailCustom } from 'src/decorators/isNotEmptyEmailCustom';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { PasswordDto } from 'src/shared/dto/password.dto';

export class RegisterDto extends PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  email: string;
}
