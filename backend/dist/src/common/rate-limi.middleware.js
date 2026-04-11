"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_module_1 = require("../infrastructure/redis/redis.module");
const LIMITS = {
    FREE: 20,
    PAID: 100,
};
const WINDOW_SECONDS = 60;
let RateLimitGuard = class RateLimitGuard {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        const tier = user.subscription_status;
        const limit = LIMITS[tier] ?? LIMITS.FREE;
        const key = `rate:${user.id}`;
        const current = await this.redis.incr(key);
        if (current === 1) {
            await this.redis.expire(key, WINDOW_SECONDS);
        }
        if (current > limit) {
            const ttl = await this.redis.ttl(key);
            throw new common_1.HttpException({
                statusCode: 429,
                error: 'Too Many Requests',
                message: `Rate limit exceeded. ${tier} tier allows ${limit} requests/min. Retry in ${ttl}s.`,
                retryAfter: ttl,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const res = context.switchToHttp().getResponse();
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], RateLimitGuard);
//# sourceMappingURL=rate-limi.middleware.js.map