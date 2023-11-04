import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsNumberCustom } from 'src/decorators/isNumberCustom';

export class UpdateGroupGeoDto {
  @ApiProperty()
  @IsNumberCustom()
  @IsOptional()
  lat: number;
  @ApiProperty()
  @IsNumberCustom()
  @IsOptional()
  lon: number;
}
