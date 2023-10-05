import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator'

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(6, 24)
  @IsStrongPassword({ minNumbers: 1, minSymbols: 1, minLength: 6 })
  password: string
}
