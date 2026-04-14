import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UserDto {
  @ApiPropertyOptional({ example: 'Display Name of the user ie: SthaRam' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  display_name?: string;

  @ApiPropertyOptional({ example: 'User Full Name ie: Ram Shrestha' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}
