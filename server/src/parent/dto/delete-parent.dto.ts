import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom';
import { IsStringCustom } from '../../shared/decorators/isStringCustom';

export class DeleteParentDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  email: string;
}
