import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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

  constructor(private readonly jwtService: JwtService) {
    EventsGateway.instance++;
    console.log(`EventsGateway instance #${EventsGateway.instance} created`);
  }

  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;

    if (!token) {
      this.logger.warn(
        `Connection rejected — no token provided (${client.id})`,
      );
      client.disconnect();
      return;
    }

    let userId: string;

    try {
      const payload = this.jwtService.verify(token);
      userId = payload.sub;
    } catch {
      this.logger.warn(
        `Connection rejected — invalid or expired token (${client.id})`,
      );
      client.disconnect();
      return;
    }

    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, new Set());
    }

    client.data.userId = userId;

    this.userSocketMap.get(userId).add(client.id);
    this.logger.log(`User ${userId} connected → socket ${client.id}`);

    client.emit('connected.ack', { message: 'socket registered', userId });

    const pending = this.pendingEvents.get(userId);
    if (pending?.length) {
      for (const { event, payload } of pending) {
        client.emit(event, payload);
      }
      this.pendingEvents.delete(userId);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;

    if (userId) {
      const sockets = this.userSocketMap.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSocketMap.delete(userId);
        }
      }
      this.logger.log(`User ${userId} disconnected → socket ${client.id}`);
    }
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    const sockets = this.userSocketMap.get(userId);

    if (!sockets || sockets.size === 0) {
      this.logger.warn(`User ${userId} is offline — queuing event "${event}"`);

      if (!this.pendingEvents.has(userId)) {
        this.pendingEvents.set(userId, []);
      }
      this.pendingEvents.get(userId).push({ event, payload });
      return;
    }

    for (const socketId of sockets) {
      this.logger.debug(`Emitting "${event}" to socket ${socketId}`);
      this.server.to(socketId).emit(event, payload);
    }
  }
}
