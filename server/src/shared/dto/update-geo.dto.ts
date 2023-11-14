import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyCustom } from 'src/shared/decorators/isNotEmptyCustom';
import { IsNumberCustom } from 'src/shared/decorators/isNumberCustom';

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
