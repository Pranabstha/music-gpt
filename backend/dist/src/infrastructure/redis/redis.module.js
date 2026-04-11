"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = void 0;
const common_1 = require("@nestjs/common");
const redis_constants_1 = require("./redis.constants");
const ioredis_1 = __importDefault(require("ioredis"));
const RateLimitGuard_1 = require("../../common/RateLimitGuard");
const cache_service_1 = require("./cache.service");
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: redis_constants_1.REDIS_CLIENT,
                useFactory: () => {
                    const url = process.env.REDIS_URL || 'redis://localhost:6380';
                    const client = new ioredis_1.default(url, {
                        maxRetriesPerRequest: 3,
                        retryStrategy: (times) => {
                            if (times > 3)
                                return null;
                            return Math.min(times * 200, 6000);
                        },
                    });
                    client.on('connect', () => console.log(`✅ Redis connected → ${url}`));
                    client.on('error', (err) => console.error('❌ Redis error:', err.message));
                    return client;
                },
            },
            cache_service_1.CacheService,
            RateLimitGuard_1.RateLimitGuard,
        ],
        exports: [redis_constants_1.REDIS_CLIENT, cache_service_1.CacheService, RateLimitGuard_1.RateLimitGuard],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map