import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'

export class CodeDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  code: string
}
