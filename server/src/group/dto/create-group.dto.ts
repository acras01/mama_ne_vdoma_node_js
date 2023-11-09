import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class CreateGroupDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  name: string;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  desc: string;
}
