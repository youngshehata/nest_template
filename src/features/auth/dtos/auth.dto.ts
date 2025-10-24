import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @ApiProperty({
    type: String,
    required: true,
    default: 'a.shehata.dev@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(200)
  @ApiProperty({ type: String, required: true, default: 'password123' })
  password: string;
}
