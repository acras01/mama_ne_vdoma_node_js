import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';

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
