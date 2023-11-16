import { isLengthCustom } from 'src/decorators/isLengthCustom';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyPasswordCustom } from 'src/decorators/isNotEmptyPasswordCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsStrongPasswordCustom } from 'src/decorators/isStrongPasswordCustom';

export class PasswordDto {
  @IsStringCustom()
  @ApiProperty()
  @isLengthCustom(6, 24)
  @IsStrongPasswordCustom()
  @IsNotEmptyPasswordCustom()
  password: string;
}
