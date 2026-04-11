"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisModule = exports.REDIS_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.REDIS_CLIENT,
                useFactory: () => {
                    const url = process.env.REDIS_URL || 'redis://localhost:6380';
                    const client = new ioredis_1.Redis(url, {
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
                    client.on('error', (err) => console.error('❌ Redis error:', err.message));
                    client.on('close', () => console.warn('⚠️  Redis connection closed'));
                    return client;
                },
            },
        ],
        exports: [exports.REDIS_CLIENT],
    })
], RedisModule);
//# sourceMappingURL=redis.module.js.map