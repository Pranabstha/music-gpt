import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../infrastructure/redis/cache.service";
import { AudioDto } from './audio.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class AudioService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, requesterId: string, dto: AudioDto): Promise<{
        id: string;
        title: string;
        url: string;
        userId: string;
        updatedAt: Date;
    }>;
}
