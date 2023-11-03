import { ApiProperty } from '@nestjs/swagger';
import { LengthCustom } from 'src/decorators/LengthCustom';
import { IsNotEmptyPasswordCustom } from 'src/decorators/isNotEmptyPasswordCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsStrongPasswordCustom } from 'src/decorators/isStrongPasswordCustom';

export class PasswordDto {
  @IsStringCustom()
  @ApiProperty()
  @LengthCustom()
  @IsStrongPasswordCustom()
  @IsNotEmptyPasswordCustom()
  password: string;
}
