import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/infrastructure/redis/cache.service';
import { UpdateAudioDto } from './audio.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const CACHE_TTL = 60;
const key = {
  one: (id: string) => `cache:audio:${id}`,
  list: (cursor: string, limit: number) =>
    `cache:audio:list:${cursor}:${limit}`,
};

@Injectable()
export class AudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  // ─── GET /audio ───────────────────────────────────────────────
  async findAll(pagination: PaginationDto) {
    const { limit = 10, cursor } = pagination;
    const cacheKey = key.list(cursor ?? 'start', limit);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

  // ─── GET /audio/:id ───────────────────────────────────────────
  async findOne(id: string) {
    const cacheKey = key.one(id);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

    if (!audio) throw new NotFoundException('Audio not found');

    await this.cache.set(cacheKey, audio, CACHE_TTL);
    return audio;
  }

  // ─── PUT /audio/:id ───────────────────────────────────────────
  async update(id: string, requesterId: string, dto: UpdateAudioDto) {
    const audio = await this.prisma.audio.findUnique({ where: { id } });
    if (!audio) throw new NotFoundException('Audio not found');

    // Users can only update their own audio
    if (audio.userId !== requesterId) {
      throw new ForbiddenException('Cannot update audio you do not own');
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

    // Invalidate caches
    await this.cache.del(key.one(id));
    await this.cache.delByPattern('cache:audio:list:*');

    return updated;
  }
}
