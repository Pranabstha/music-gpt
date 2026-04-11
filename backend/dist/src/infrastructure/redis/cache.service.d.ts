import { Redis } from 'ioredis';
export declare class CacheService {
    readonly redis: Redis;
    constructor(redis: Redis);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    del(...keys: string[]): Promise<void>;
    delByPattern(pattern: string): Promise<void>;
}
