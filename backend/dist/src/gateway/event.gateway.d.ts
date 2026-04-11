import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private userSocketMap;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitToUser(userId: string, event: string, payload: unknown): void;
}
