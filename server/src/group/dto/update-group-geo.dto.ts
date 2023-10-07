import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGroupGeoDt {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  lat: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  lon: number;
}
