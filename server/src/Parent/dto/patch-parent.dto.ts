import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class PatchParentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z ]+$/gm, { message: 'Must include only letters or space' })
  @IsNotEmpty()
  @Length(6, 18)
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  countryCode: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatar: string;
}
