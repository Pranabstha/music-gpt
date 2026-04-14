import { NestFactory } from '@nestjs/core';
import { WorkersModule } from './workers/worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkersModule);
  app.enableShutdownHooks();
}

bootstrap();
