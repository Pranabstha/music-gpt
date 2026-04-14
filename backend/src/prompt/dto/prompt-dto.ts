import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class PromptDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  @ApiProperty({ example: 'User Prompt ie: Create a jazz song' })
  text: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Style of the music ie: Jazz' })
  style?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Duration of the music ie: 30s' })
  duration?: string;
}
