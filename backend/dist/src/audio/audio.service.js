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
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("../infrastructure/redis/cache.service");
const CACHE_TTL = 60;
const key = {
    one: (id) => `cache:audio:${id}`,
    list: (cursor, limit) => `cache:audio:list:${cursor}:${limit}`,
};
let AudioService = class AudioService {
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
        const audios = await this.prisma.audio.findMany({
            take: limit + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor },
            }),
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                url: true,
                userId: true,
                promptId: true,
                createdAt: true,
            },
        });
        const hasNextPage = audios.length > limit;
        const data = hasNextPage ? audios.slice(0, -1) : audios;
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
        const audio = await this.prisma.audio.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                url: true,
                userId: true,
                promptId: true,
                createdAt: true,
                updatedAt: true,
                prompt: {
                    select: { text: true, status: true },
                },
            },
        });
        if (!audio)
            throw new common_1.NotFoundException('Audio not found');
        await this.cache.set(cacheKey, audio, CACHE_TTL);
        return audio;
    }
    async update(id, requesterId, dto) {
        const audio = await this.prisma.audio.findUnique({ where: { id } });
        if (!audio)
            throw new common_1.NotFoundException('Audio not found');
        if (audio.userId !== requesterId) {
            throw new common_1.ForbiddenException('Cannot update audio you do not own');
        }
        const updated = await this.prisma.audio.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                title: true,
                url: true,
                userId: true,
                updatedAt: true,
            },
        });
        await this.cache.del(key.one(id));
        await this.cache.delByPattern('cache:audio:list:*');
        return updated;
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], AudioService);
//# sourceMappingURL=audio.service.js.map