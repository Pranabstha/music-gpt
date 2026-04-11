import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AudioDto {
  @ApiPropertyOptional({ example: 'My Cool Track' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
