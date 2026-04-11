import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Redis } from 'ioredis';
export declare class RateLimitGuard implements CanActivate {
    private readonly redis;
    constructor(redis: Redis);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
