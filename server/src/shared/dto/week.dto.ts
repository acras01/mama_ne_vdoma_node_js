import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsBooleanCustom } from 'src/decorators/isBooleanCustom';
import { IsDefinedCustom } from 'src/decorators/isDefinedCustom';
import { IsNotEmptyObjectCustom } from 'src/decorators/isNotEmptyObjectCustom';
import { IsObjectCustom } from 'src/decorators/isObjectCustom';

export class DayDto {
  @ApiProperty()
  @IsBooleanCustom()
  morning: boolean;
  @ApiProperty()
  @IsBooleanCustom()
  lunch: boolean;
  @ApiProperty()
  @IsBooleanCustom()
  evening: boolean;
}

export class WeekDto {
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  monday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  tuesday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  wednesday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  thursday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  friday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  saturday: DayDto;
  @ApiProperty()
  @IsDefinedCustom()
  @IsNotEmptyObjectCustom()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => DayDto)
  sunday: DayDto;
}
