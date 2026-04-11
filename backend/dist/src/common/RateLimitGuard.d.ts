import { CanActivate, ExecutionContext } from '@nestjs/common';
import { CacheService } from "../infrastructure/redis/cache.service";
export declare class RateLimitGuard implements CanActivate {
    private readonly cacheService;
    constructor(cacheService: CacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
