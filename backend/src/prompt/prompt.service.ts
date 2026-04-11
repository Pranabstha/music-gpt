import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptDto } from './dto/prompt-dto';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: PromptDto, userId: string) {
    return this.prisma.prompt.create({
      data: {
        text: dto.text,
        userId,
        status: 'PENDING',
      },
    });
  }
}
