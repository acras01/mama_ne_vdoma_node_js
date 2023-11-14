import { IsNotEmptyEmailCustom } from '../../shared/decorators/isNotEmptyEmailCustom'
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'
import { PasswordDto } from './../../shared/dto/password.dto'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto extends PasswordDto {
  @ApiProperty()
  @IsStringCustom()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  email: string
}
