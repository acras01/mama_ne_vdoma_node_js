import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsNumberCustom } from 'src/decorators/isNumberCustom';

export class UpdateGeoDto {
  @ApiProperty()
  @IsNumberCustom()
  @IsNotEmptyCustom()
  lon: number;
  @ApiProperty()
  @IsNumberCustom()
  @IsNotEmptyCustom()
  lat: number;
}
