import { ApiProperty } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
