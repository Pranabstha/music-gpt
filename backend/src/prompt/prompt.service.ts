import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptDto } from './dto/prompt-dto';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: PromptDto, userId: string) {
    const prompt = await this.prisma.prompt.create({
      data: {
        text: dto.text,
        userId,
        status: 'PENDING',
      },
    });

    return {
      id: prompt.id,
      status: 'PENDING',
      message:
        'Prompt received. You will be notified via WebSocket when ready.',
    };
  }
}
