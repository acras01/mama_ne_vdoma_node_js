import { ApiProperty } from '@nestjs/swagger';

export class CompleteRegisterDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  lat: string;
  @ApiProperty()
  lon: string;
}
