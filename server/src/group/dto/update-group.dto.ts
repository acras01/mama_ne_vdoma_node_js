import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WeekDto } from 'src/shared/dto/week.dto';
import { GroupAgeValidate } from '../validator/age.validator';

export class UpdateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  desc: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @GroupAgeValidate()
  ages: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @GroupAgeValidate()
  avatar: string;
  @ApiProperty({ type: WeekDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto;
}
