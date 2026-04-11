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

  private userSocketMap = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }
    this.userSocketMap.set(userId, client.id);
    this.logger.log(`User ${userId} connected → socket ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.logger.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    const socketId = this.userSocketMap.get(userId);
    if (!socketId) {
      this.logger.warn(`No socket found for user ${userId}`);
      return;
    }
    this.server.to(socketId).emit(event, payload);
  }
}
