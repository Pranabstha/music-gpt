import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { PromptsService } from './prompt.service';
import { PromptDto } from './dto/prompt-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('prompts')
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async create(@Body() dto: PromptDto, @Request() req) {
    const prompt = await this.promptsService.create(dto, req.user.id);
    return prompt;
  }
}
