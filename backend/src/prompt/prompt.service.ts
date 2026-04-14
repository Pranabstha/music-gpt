import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptDto } from './dto/prompt-dto';
import { PromptStatus } from '@prisma/client';

@Injectable()
export class PromptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: PromptDto, userId: string) {
    try {
      const prompt = await this.prisma.prompt.create({
        data: {
          text: dto.text,
          userId,
          status: PromptStatus.PENDING,
        },
      });

      return prompt;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
