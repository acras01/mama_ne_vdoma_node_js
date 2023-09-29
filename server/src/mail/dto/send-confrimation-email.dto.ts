import { IsEmail, IsString } from 'class-validator';

export class SendConfirmationEmail {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
