import { IsNotEmptyCustom } from 'src/shared/decorators/isNotEmptyCustom';
import { IsNumberCustom } from '../../shared/decorators/isNumberCustom';
import { ApiProperty } from '@nestjs/swagger';
import { IsStringCustom } from 'src/shared/decorators/isStringCustom';
export class CreateKarmaDto {
  @ApiProperty()
  @IsNumberCustom(1, 5)
  @IsNotEmptyCustom()
  grade: number;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  message: string;
}