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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../infrastructure/redis/cache.service");
const CACHE_TTL = 60;
const key = {
    one: (id) => `cache:users:${id}`,
    list: (cursor, limit) => `cache:users:list:${cursor}:${limit}`,
};
let UsersService = class UsersService {
    prisma;
    cache;
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async findAll(pagination) {
        const { limit = 10, cursor } = pagination;
        const cacheKey = key.list(cursor ?? 'start', limit);
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        const users = await this.prisma.user.findMany({
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor },
            }),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                display_name: true,
                subscription_status: true,
                createdAt: true,
            },
        });
        const hasNextPage = users.length > limit;
        const data = hasNextPage ? users.slice(0, -1) : users;
        const nextCursor = hasNextPage ? data[data.length - 1].id : null;
        const result = {
            data,
            meta: { next_cursor: nextCursor, limit, count: data.length },
        };
        await this.cache.set(cacheKey, result, CACHE_TTL);
        return result;
    }
    async findOne(id) {
        const cacheKey = key.one(id);
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                display_name: true,
                subscription_status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.cache.set(cacheKey, user, CACHE_TTL);
        return user;
    }
    async update(id, requesterId, dto) {
        if (id !== requesterId)
            throw new common_1.ForbiddenException('Cannot update another user');
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updated = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                name: true,
                display_name: true,
                subscription_status: true,
                updatedAt: true,
            },
        });
        await this.cache.del(key.one(id));
        await this.cache.delByPattern('cache:users:list:*');
        return updated;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], UsersService);
//# sourceMappingURL=user.service.js.map