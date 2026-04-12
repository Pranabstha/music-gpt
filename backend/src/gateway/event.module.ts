import { Module } from '@nestjs/common';
import { EventsGateway } from './event.gateway';
import { EventsController } from './event.controller';

@Module({
  controllers: [EventsController],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
