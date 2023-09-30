import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGeoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  lon: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  lat: number;
}
