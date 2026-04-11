import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { PromptProcessor, PROMPT_QUEUE } from './prompt.processor';
import { EventsModule } from 'src/gateway/event.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: PROMPT_QUEUE }),
    EventsModule,
    PrismaModule,
  ],
  providers: [PromptProcessor],
})
export class WorkersModule {}
