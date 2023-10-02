import { ApiProperty } from '@nestjs/swagger';
import { SendConfirmationEmail } from './send-confrimation-email.dto';
import { IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class ResetPasswordDto extends SendConfirmationEmail {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 24)
  @IsStrongPassword({ minNumbers: 1, minSymbols: 1 })
  password: string;
}
