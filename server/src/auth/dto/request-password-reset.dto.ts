import { ApiProperty } from '@nestjs/swagger'
import { IsEmailCustom } from '../../shared/decorators/isEmailCustom'
import { IsNotEmptyEmailCustom } from '../../shared/decorators/isNotEmptyEmailCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'

export class RequestPasswordResetDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsNotEmptyEmailCustom()
  @IsStringCustom()
  email: string
}
