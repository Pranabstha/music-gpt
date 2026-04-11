import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class PromptScheduler {
    private readonly prisma;
    private readonly promptQueue;
    private readonly logger;
    constructor(prisma: PrismaService, promptQueue: Queue);
    enqueuePendingPrompts(): Promise<void>;
}
