import { ApiProperty } from '@nestjs/swagger';
import { LengthCustom } from 'src/shared/decorators/LengthCustom';
import { IsNotEmptyPasswordCustom } from 'src/shared/decorators/isNotEmptyPasswordCustom';
import { IsStringCustom } from 'src/shared/decorators/isStringCustom';
import { IsStrongPasswordCustom } from 'src/shared/decorators/isStrongPasswordCustom';

export class PasswordDto {
  @IsStringCustom()
  @ApiProperty()
  @LengthCustom(6, 24)
  @IsStrongPasswordCustom()
  @IsNotEmptyPasswordCustom()
  password: string;
}
