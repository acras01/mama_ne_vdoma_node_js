import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDto } from '../../shared/dto/week.dto';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsBooleanCustom } from 'src/decorators/isBooleanCustom';
import { IsDefinedCustom } from 'src/decorators/isDefinedCustom';
import { IsNotEmptyObjectCustom } from 'src/decorators/isNotEmptyObjectCustom';
import { IsObjectCustom } from 'src/decorators/isObjectCustom';
import { isLengthCustom } from 'src/decorators/isLengthCustom';
import { isMatchesCustom } from 'src/decorators/isMatchesCustom';

export class UpdateParentDto {
  @ApiProperty()
  @IsStringCustom()
  @isMatchesCustom()
  @IsNotEmptyCustom()
  @isLengthCustom(2, 18)
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsBooleanCustom()
  @IsOptional()
  sendingEmails: boolean;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  countryCode: string;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  deviceId: string;
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  avatar: string;
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
  week: WeekDto;
}
