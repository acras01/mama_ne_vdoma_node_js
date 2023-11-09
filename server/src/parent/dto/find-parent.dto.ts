import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class FindParentDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsEmailCustom()
  email: string;
}
