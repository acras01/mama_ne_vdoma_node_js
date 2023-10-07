import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { WeekDto } from 'src/shared/dto/week.dto';

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
  ages: string;
  @ApiProperty({ type: WeekDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto;
}
