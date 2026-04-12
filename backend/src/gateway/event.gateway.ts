import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  private userSocketMap = new Map<string, Set<string>>();
  private pendingEvents = new Map<
    string,
    Array<{ event: string; payload: unknown }>
  >();

  private static instance = 0;

  constructor() {
    EventsGateway.instance++;
    console.log(`EventsGateway instance #${EventsGateway.instance} created`);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) {
      client.disconnect();
      return;
    }

    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, new Set());
    }

    client.emit('connected.ack', { message: 'socket registered', userId });

    this.userSocketMap.get(userId).add(client.id);
    this.logger.log(`User ${userId} connected → socket ${client.id}`);

    const pending = this.pendingEvents.get(userId);
    if (pending?.length) {
      for (const { event, payload } of pending) {
        client.emit(event, payload);
      }
      this.pendingEvents.delete(userId);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSocketMap.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);

        if (sockets.size === 0) {
          this.userSocketMap.delete(userId);
        }

        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    const sockets = this.userSocketMap.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.warn(`No active sockets for user ${userId}`);
      return;
    }

    for (const socketId of sockets) {
      this.logger.debug(`Emitting ${event} to socket ${socketId}`);
      this.server.to(socketId).emit(event, payload);
    }
  }
}
