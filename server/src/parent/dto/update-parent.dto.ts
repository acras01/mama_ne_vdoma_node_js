import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDto } from '../../shared/dto/week.dto';
import { MatchesCustom } from 'src/decorators/matchesCustom';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsBooleanCustom } from 'src/decorators/isBooleanCustom';
import { IsDefinedCustom } from 'src/decorators/isDefinedCustom';
import { IsNotEmptyObjectCustom } from 'src/decorators/isNotEmptyObjectCustom';
import { IsObjectCustom } from 'src/decorators/isObjectCustom';
import { LengthCustom } from 'src/decorators/LengthCustom';

export class UpdateParentDto {
  @ApiProperty()
  @IsString()
  @MatchesCustom()
  @IsNotEmptyCustom()
  @LengthCustom(2, 18)
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
