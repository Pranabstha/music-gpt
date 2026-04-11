import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../infrastructure/redis/cache.service";
import { UpdateAudioDto } from './audio.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class AudioService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, requesterId: string, dto: UpdateAudioDto): Promise<{
        id: string;
        updatedAt: Date;
        title: string;
        url: string;
        userId: string;
    }>;
}
