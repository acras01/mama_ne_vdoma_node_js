import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class DeleteParentDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  email: string;
}
