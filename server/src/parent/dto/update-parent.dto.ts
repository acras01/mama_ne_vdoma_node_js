import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeekDto } from '../../shared/dto/week.dto';

export class UpdateParentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Zа-яА-Яі0-9 -]+$/gm, { message: 'Must include only letters,- or space' })
  @IsNotEmpty()
  @Length(6, 18)
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  countryCode: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
