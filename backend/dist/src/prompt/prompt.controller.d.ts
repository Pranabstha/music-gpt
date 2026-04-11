import { PromptsService } from './prompt.service';
import { PromptDto } from './dto/prompt-dto';
export declare class PromptsController {
    private readonly promptsService;
    constructor(promptsService: PromptsService);
    create(dto: PromptDto, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PromptStatus;
        message: string;
    }>;
}
