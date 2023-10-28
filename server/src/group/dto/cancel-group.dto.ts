import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CancelGroupDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  parentId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  childId: string;
}
