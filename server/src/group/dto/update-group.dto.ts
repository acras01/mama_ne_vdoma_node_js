import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { WeekDto } from 'src/shared/dto/week.dto';
import { GroupAgeValidate } from '../validator/age.validator';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsDefinedCustom } from 'src/decorators/isDefinedCustom';
import { IsObjectCustom } from 'src/decorators/isObjectCustom';
import { IsNotEmptyObjectCustom } from 'src/decorators/isNotEmptyObjectCustom';

export class UpdateGroupDto {
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  desc: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  @GroupAgeValidate()
  ages: string;
  @ApiProperty()
  @IsNotEmptyCustom()
  @IsStringCustom()
  @IsOptional()
  avatar: string;
  @ApiProperty({ type: WeekDto })
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto;
}
