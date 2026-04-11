import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from 'src/gateway/event.gateway';

export const PROMPT_QUEUE = 'prompt-queue';

export interface PromptJobData {
  promptId: string;
  userId: string;
}

@Injectable()
@Processor(PROMPT_QUEUE)
export class PromptProcessor extends WorkerHost {
  private readonly logger = new Logger(PromptProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {
    super();
  }

  async process(job: Job<PromptJobData>): Promise<void> {
    const { promptId, userId } = job.data;
    this.logger.log(`Processing prompt ${promptId}`);

    await this.prisma.prompt.update({
      where: { id: promptId },
      data: { status: 'PROCESSING' },
    });

    const delay = 3000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const prompt = await this.prisma.prompt.findUnique({
      where: { id: promptId },
      select: { text: true },
    });

    if (prompt) {
      const audio = await this.prisma.audio.create({
        data: {
          title: prompt.text.slice(0, 80),
          url: `https://cdn.example.com/audio/${promptId}.mp3`,
          userId,
          promptId,
        },
      });

      await this.prisma.prompt.update({
        where: { id: promptId },
        data: { status: 'COMPLETED' },
      });

      this.eventsGateway.emitToUser(userId, 'prompt.completed', {
        promptId,
        status: 'COMPLETED',
        audio: {
          id: audio.id,
          title: audio.title,
          url: audio.url,
        },
      });
    }

    this.logger.log(`Prompt ${promptId} completed → notified user ${userId}`);
  }
}
