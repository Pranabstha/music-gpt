import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { PromptJobData, PROMPT_QUEUE } from '../workers/prompt.processor';
import { PromptStatus } from '@prisma/client';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PromptScheduler {
  private readonly logger = new Logger(PromptScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(PROMPT_QUEUE) private readonly promptQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async enqueuePendingPrompts() {
    const pendingPrompts = await this.prisma.prompt.findMany({
      where: { status: PromptStatus.PENDING },
      include: { user: true },
    });

    if (!pendingPrompts.length) return;

    this.logger.log(`Enqueueing ${pendingPrompts.length} pending prompt(s)`);

    for (const prompt of pendingPrompts) {
      const isPaid =
        prompt.user.subscription_status === SubscriptionStatus.PAID;

      await this.prisma.prompt.update({
        where: { id: prompt.id },
        data: { status: PromptStatus.PROCESSING },
      });

      const jobData: PromptJobData = {
        promptId: prompt.id,
        userId: prompt.userId,
      };

      await this.promptQueue.add('process-prompt', jobData, {
        priority: isPaid ? 1 : 2,
        jobId: prompt.id,
        removeOnComplete: true,
        removeOnFail: false,
      });
    }
  }
}
