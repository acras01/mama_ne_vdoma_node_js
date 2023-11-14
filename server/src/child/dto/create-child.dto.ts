import { ApiProperty } from '@nestjs/swagger'
import { IsBooleanCustom } from '../../shared/decorators/isBooleanCustom'
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom'
import { IsNumberCustom } from '../../shared/decorators/isNumberCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'

export class CreateChildDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  name: string
  @ApiProperty()
  @IsNumberCustom(0, 18)
  age: number
  @ApiProperty()
  @IsBooleanCustom()
  isMale: boolean
}
