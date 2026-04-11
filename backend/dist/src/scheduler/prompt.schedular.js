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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PromptScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const prompt_processor_1 = require("../workers/prompt.processor");
let PromptScheduler = PromptScheduler_1 = class PromptScheduler {
    prisma;
    promptQueue;
    logger = new common_1.Logger(PromptScheduler_1.name);
    constructor(prisma, promptQueue) {
        this.prisma = prisma;
        this.promptQueue = promptQueue;
    }
    async enqueuePendingPrompts() {
        const pendingPrompts = await this.prisma.prompt.findMany({
            where: { status: 'PENDING' },
            include: { user: true },
        });
        if (!pendingPrompts.length)
            return;
        this.logger.log(`Enqueueing ${pendingPrompts.length} pending prompt(s)`);
        for (const prompt of pendingPrompts) {
            const isPaid = prompt.user.subscription_status === 'PAID';
            const jobData = {
                promptId: prompt.id,
                userId: prompt.userId,
            };
            await this.promptQueue.add('process-prompt', jobData, {
                priority: isPaid ? 1 : 2,
                jobId: prompt.id,
                removeOnComplete: true,
                removeOnFail: false,
            });
        }
    }
};
exports.PromptScheduler = PromptScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromptScheduler.prototype, "enqueuePendingPrompts", null);
exports.PromptScheduler = PromptScheduler = PromptScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(prompt_processor_1.PROMPT_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], PromptScheduler);
//# sourceMappingURL=prompt.schedular.js.map