import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './serach.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
