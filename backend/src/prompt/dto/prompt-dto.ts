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
  text: string;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}
