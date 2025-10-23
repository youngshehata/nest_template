import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BlacklistDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(39)
  @ApiProperty({ nullable: false, minLength: 2, maxLength: 39 })
  ip: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
