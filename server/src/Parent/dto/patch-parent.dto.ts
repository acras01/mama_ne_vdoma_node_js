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
import { WeekDto } from 'src/shared/dto/week.dto';
import { Type } from 'class-transformer';

export class PatchParentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/gm, { message: 'Must include only letters or space' })
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
