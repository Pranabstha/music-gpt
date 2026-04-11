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
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const redis_constants_1 = require("./redis.constants");
let CacheService = class CacheService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async get(key) {
        const data = await this.redis.get(key);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    async set(key, value, ttlSeconds = 60) {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    async del(...keys) {
        if (keys.length)
            await this.redis.del(...keys);
    }
    async delByPattern(pattern) {
        const keys = await this.redis.keys(pattern);
        if (keys.length)
            await this.redis.del(...keys);
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_constants_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], CacheService);
//# sourceMappingURL=cache.service.js.map