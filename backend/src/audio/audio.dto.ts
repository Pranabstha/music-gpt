import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class AudioDto {
  @ApiProperty({ example: 'Audio Title(name of the track)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
