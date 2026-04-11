import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CacheService } from 'src/infrastructure/redis/cache.service';

const LIMITS = { FREE: 20, PAID: 100 };
const WINDOW_SECONDS = 60;

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly cacheService: CacheService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true;

    const tier = user.subscription_status as 'FREE' | 'PAID';
    const limit = LIMITS[tier] ?? LIMITS.FREE;
    const key = `rate:${user.id}`;

    const current = await this.cacheService.redis.incr(key);
    if (current === 1)
      await this.cacheService.redis.expire(key, WINDOW_SECONDS);
    if (current > limit) {
      const ttl = await this.cacheService.redis.ttl(key);
      throw new HttpException(
        {
          statusCode: 429,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. ${tier} tier allows ${limit} requests/min. Retry in ${ttl}s.`,
          retryAfter: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const res = context.switchToHttp().getResponse();
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
    return true;
  }
}
