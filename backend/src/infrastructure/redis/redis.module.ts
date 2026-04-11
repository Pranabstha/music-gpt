// redis.module.ts
import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import Redis from 'ioredis';
import { RateLimitGuard } from 'src/common/RateLimitGuard';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        const url = process.env.REDIS_URL || 'redis://localhost:6380';
        const client = new Redis(url, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            if (times > 3) return null;
            return Math.min(times * 200, 6000);
          },
        });
        client.on('connect', () => console.log(`✅ Redis connected → ${url}`));
        client.on('error', (err) =>
          console.error('❌ Redis error:', err.message),
        );
        return client;
      },
    },
    CacheService,
    RateLimitGuard,
  ],
  exports: [REDIS_CLIENT, CacheService, RateLimitGuard],
})
export class RedisModule {}
