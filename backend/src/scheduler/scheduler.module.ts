import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PromptScheduler } from './prompt.schedular';
import { PROMPT_QUEUE } from '../workers/prompt.processor';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [BullModule.registerQueue({ name: PROMPT_QUEUE }), PrismaModule],
  providers: [PromptScheduler],
})
export class SchedulerModule {}
