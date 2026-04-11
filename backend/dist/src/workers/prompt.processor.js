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
var PromptProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptProcessor = exports.PROMPT_QUEUE = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const event_gateway_1 = require("../gateway/event.gateway");
exports.PROMPT_QUEUE = 'prompt-queue';
let PromptProcessor = PromptProcessor_1 = class PromptProcessor extends bullmq_1.WorkerHost {
    prisma;
    eventsGateway;
    logger = new common_1.Logger(PromptProcessor_1.name);
    constructor(prisma, eventsGateway) {
        super();
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async process(job) {
        const { promptId, userId } = job.data;
        this.logger.log(`Processing prompt ${promptId}`);
        await this.prisma.prompt.update({
            where: { id: promptId },
            data: { status: 'PROCESSING' },
        });
        const delay = 3000 + Math.random() * 2000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        const prompt = await this.prisma.prompt.findUnique({
            where: { id: promptId },
            select: { text: true },
        });
        if (prompt) {
            const audio = await this.prisma.audio.create({
                data: {
                    title: prompt.text.slice(0, 80),
                    url: `https://cdn.example.com/audio/${promptId}.mp3`,
                    userId,
                    promptId,
                },
            });
            await this.prisma.prompt.update({
                where: { id: promptId },
                data: { status: 'COMPLETED' },
            });
            this.eventsGateway.emitToUser(userId, 'prompt.completed', {
                promptId,
                status: 'COMPLETED',
                audio: {
                    id: audio.id,
                    title: audio.title,
                    url: audio.url,
                },
            });
        }
        this.logger.log(`Prompt ${promptId} completed → notified user ${userId}`);
    }
};
exports.PromptProcessor = PromptProcessor;
exports.PromptProcessor = PromptProcessor = PromptProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bullmq_1.Processor)(exports.PROMPT_QUEUE),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_gateway_1.EventsGateway])
], PromptProcessor);
//# sourceMappingURL=prompt.processor.js.map