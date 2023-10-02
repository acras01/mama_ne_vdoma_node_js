import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Length(6, 24)
  @IsStrongPassword({ minNumbers: 1, minSymbols: 1, minLength: 6 })
  password: string;
}
