import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { WeekDto } from '../../shared/dto/week.dto'
import { MatchesCustom } from '../../shared/decorators/matchesCustom'
import { IsNotEmptyCustom } from '../../shared/decorators/isNotEmptyCustom'
import { IsStringCustom } from '../../shared/decorators/isStringCustom'
import { IsBooleanCustom } from '../../shared/decorators/isBooleanCustom'
import { IsDefinedCustom } from '../../shared/decorators/isDefinedCustom'
import { IsNotEmptyObjectCustom } from '../../shared/decorators/isNotEmptyObjectCustom'
import { IsObjectCustom } from '../../shared/decorators/isObjectCustom'
import { LengthCustom } from '../../shared/decorators/LengthCustom'

export class UpdateParentDto {
  @ApiProperty()
  @IsStringCustom()
  @isMatchesCustom()
  @IsNotEmptyCustom()
  @isLengthCustom(2, 18)
  @IsOptional()
  name: string
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  phone: string
  @ApiProperty()
  @IsBooleanCustom()
  @IsOptional()
  sendingEmails: boolean
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  countryCode: string
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  deviceId: string
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  avatar: string
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  note: string;
  @ApiProperty({ type: WeekDto })
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto
}
