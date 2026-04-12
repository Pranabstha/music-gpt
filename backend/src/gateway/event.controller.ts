import { Controller, Post, Body, Param } from '@nestjs/common';
import { EventsGateway } from './event.gateway';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  @Post(':userId')
  emitToUser(
    @Param('userId') userId: string,
    @Body() body: { event: string; payload: unknown },
  ) {
    this.eventsGateway.emitToUser(userId, body.event, body.payload);
    return { sent: true, userId, event: body.event };
  }
}
