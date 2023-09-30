import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @ApiProperty()
  code: string;
}
