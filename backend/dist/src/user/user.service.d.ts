import { PrismaService } from "../prisma/prisma.service";
import { CacheService } from "../infrastructure/redis/cache.service";
import { UserDto } from './dto/user.dto';
import { PaginationDto } from "../common/dto/pagination.dto";
export declare class UsersService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(pagination: PaginationDto): Promise<{}>;
    findOne(id: string): Promise<{}>;
    update(id: string, requesterId: string, dto: UserDto): Promise<{
        display_name: string | null;
        name: string | null;
        id: string;
        email: string;
        subscription_status: import("@prisma/client").$Enums.SubscriptionStatus;
        updatedAt: Date;
    }>;
}
