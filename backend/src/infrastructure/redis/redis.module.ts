import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

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
            if (times > 3) {
              console.error('❌ Redis: max retries reached');
              return null;
            }
            return Math.min(times * 200, 2000);
          },
        });

        client.on('connect', () => console.log(`✅ Redis connected → ${url}`));
        client.on('ready', () => console.log('✅ Redis ready'));
        client.on('error', (err) =>
          console.error('❌ Redis error:', err.message),
        );
        client.on('close', () => console.warn('⚠️  Redis connection closed'));

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
