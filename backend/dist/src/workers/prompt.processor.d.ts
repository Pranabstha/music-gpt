import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from "../gateway/event.gateway";
export declare const PROMPT_QUEUE = "prompt-queue";
export interface PromptJobData {
    promptId: string;
    userId: string;
}
export declare class PromptProcessor extends WorkerHost {
    private readonly prisma;
    private readonly eventsGateway;
    private readonly logger;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    process(job: Job<PromptJobData>): Promise<void>;
}
