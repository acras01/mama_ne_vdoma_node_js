import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from 'src/decorators/isNotEmptyCustom';
import { IsNumberCustom } from 'src/decorators/isNumberCustom';

export class UpdateGeoDto {
  @ApiProperty()
  @IsNumberCustom(0, 18)
  @IsNotEmptyCustom()
  lon: number;
  @ApiProperty()
  @IsNumberCustom(0, 18)
  @IsNotEmptyCustom()
  lat: number;
}
