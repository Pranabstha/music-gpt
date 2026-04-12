import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { PROMPT_QUEUE } from '../workers/prompt.processor';
import { PromptsService } from './prompt.service';
import { PromptsController } from './prompt.controller';
import { PromptScheduler } from 'src/scheduler/prompt.schedular';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: PROMPT_QUEUE }),
    PrismaModule,
  ],
  providers: [PromptsService, PromptScheduler],
  controllers: [PromptsController],
})
export class PromptModule {}
