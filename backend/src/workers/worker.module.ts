import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PromptProcessor, PROMPT_QUEUE } from './prompt.processor';
import { EventsModule } from 'src/gateway/event.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = new URL(config.get<string>('REDIS_URL') ?? '');
        return {
          connection: {
            host: url.hostname,
            port: Number(url.port) || 6379,
          },
        };
      },
    }),

    BullModule.registerQueue({ name: PROMPT_QUEUE }),
    EventsModule,
    PrismaModule,
  ],
  providers: [PromptProcessor],
})
export class WorkersModule {}
