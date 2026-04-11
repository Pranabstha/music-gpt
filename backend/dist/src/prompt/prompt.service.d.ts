import { PrismaService } from '../prisma/prisma.service';
import { PromptDto } from './dto/prompt-dto';
export declare class PromptsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: PromptDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.PromptStatus;
        userId: string;
        text: string;
    }>;
}
