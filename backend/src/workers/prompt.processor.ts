import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptStatus } from '@prisma/client';
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
      data: { status: PromptStatus.PROCESSING },
    });

    this.eventsGateway.emitToUser(userId, 'prompt.processing', {
      promptId,
      status: PromptStatus.PROCESSING,
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
          url: `https://music-gpt.com/audio/${promptId}.mp3`,
          userId,
          promptId,
        },
      });

      await this.prisma.prompt.update({
        where: { id: promptId },
        data: { status: PromptStatus.COMPLETED },
      });

      this.eventsGateway.emitToUser(userId, 'prompt.completed', {
        promptId,
        status: PromptStatus.COMPLETED,
        audio: {
          id: audio.id,
          title: audio.title,
          url: audio.url,
        },
      });
    }

    this.logger.log(`Prompt ${promptId} completed → notified user ${userId}`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<PromptJobData>, error: Error) {
    const { promptId, userId } = job.data;
    this.logger.error(`Prompt ${promptId} failed: ${error.message}`);

    await this.prisma.prompt.update({
      where: { id: promptId },
      data: { status: PromptStatus.FAILED },
    });

    this.eventsGateway.emitToUser(userId, 'prompt.failed', {
      promptId,
      status: PromptStatus.FAILED,
      error: error.message,
    });
  }
}
