"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let EventsGateway = EventsGateway_1 = class EventsGateway {
    server;
    logger = new common_1.Logger(EventsGateway_1.name);
    userSocketMap = new Map();
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (!userId) {
            client.disconnect();
            return;
        }
        this.userSocketMap.set(userId, client.id);
        this.logger.log(`User ${userId} connected → socket ${client.id}`);
    }
    handleDisconnect(client) {
        for (const [userId, socketId] of this.userSocketMap.entries()) {
            if (socketId === client.id) {
                this.userSocketMap.delete(userId);
                this.logger.log(`User ${userId} disconnected`);
                break;
            }
        }
    }
    emitToUser(userId, event, payload) {
        const socketId = this.userSocketMap.get(userId);
        if (!socketId) {
            this.logger.warn(`No socket found for user ${userId}`);
            return;
        }
        this.server.to(socketId).emit(event, payload);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
exports.EventsGateway = EventsGateway = EventsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } })
], EventsGateway);
//# sourceMappingURL=event.gateway.js.map