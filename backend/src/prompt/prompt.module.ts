import { Module } from '@nestjs/common';
import { PromptsController } from './prompt.controller';
import { PromptsService } from './prompt.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PromptsController],
  providers: [PromptsService],
})
export class PromptsModule {}
