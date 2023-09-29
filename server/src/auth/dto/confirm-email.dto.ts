import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}
