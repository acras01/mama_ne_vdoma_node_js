import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import { WeekDto } from '../../shared/dto/week.dto'
import { GroupAgeValidate } from '../validator/age.validator'
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'
import { IsDefinedCustom } from '../../shared/decorators/isDefinedCustom'
import { IsObjectCustom } from '../../shared/decorators/isObjectCustom'
import { IsNotEmptyObjectCustom } from '../../shared/decorators/isNotEmptyObjectCustom'

export class UpdateGroupDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  name: string
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  desc: string
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @GroupAgeValidate()
  @IsOptional()
  ages: string
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  avatar: string
  @ApiProperty({ type: WeekDto })
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto
}
