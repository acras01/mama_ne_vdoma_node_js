import { IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator';
import { WeekDto } from '../../shared/dto/week.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsStringCustom } from 'src/decorators/isStringCustom';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsDefinedCustom } from 'src/decorators/isDefinedCustom';
import { IsObjectCustom } from 'src/decorators/isObjectCustom';

export class UpdateChildDto {
  @ApiProperty()
  @IsStringCustom()
  @IsNotEmptyCustom()
  @IsOptional()
  note: string;
  @ApiProperty({ type: WeekDto })
  @IsDefinedCustom()
  @IsNotEmptyObject()
  @IsObjectCustom()
  @ValidateNested()
  @Type(() => WeekDto)
  @IsOptional()
  week: WeekDto;
}
