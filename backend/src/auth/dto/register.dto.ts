import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'Email of the user' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'Password of the user' })
  password: string;

  @IsString()
  @ApiProperty({ example: 'Full name of the user' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Display name of the user' })
  display_name?: string;
}
