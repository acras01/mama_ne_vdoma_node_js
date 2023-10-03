import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WeekDto } from '../../shared/dto/week.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateChildDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  note: string;
  @ApiProperty({ type: WeekDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto;
}
