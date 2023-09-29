import { ApiProperty } from "@nestjs/swagger";

export class ConfirmAccountDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  code: string;
}
