import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanCustom } from 'src/decorators/isBooleanCustom';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsNumberCustom } from 'src/decorators/isNumberCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class CreateChildDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  name: string;
  @ApiProperty()
  @IsNumberCustom()
  age: number;
  @ApiProperty()
  @IsBooleanCustom()
  isMale: boolean;
}
