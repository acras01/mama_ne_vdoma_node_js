import { ApiProperty } from '@nestjs/swagger';
import { IsEmailCustom } from 'src/decorators/isEmailCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';

export class CodeDto {
  @ApiProperty()
  @IsEmailCustom()
  @IsStringCustom()
  code: string;
}
