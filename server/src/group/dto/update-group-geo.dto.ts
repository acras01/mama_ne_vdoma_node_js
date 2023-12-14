import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsNumberCustom } from '../../shared/decorators/isNumberCustom';

export class UpdateGroupGeoDto {
  @ApiProperty()
  @IsNumberCustom(0, 18)
  @IsOptional()
  lat: number;
  @ApiProperty()
  @IsNumberCustom(0, 18)
  @IsOptional()
  lon: number;
}
