import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/infrastructure/redis/cache.service';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

const CACHE_TTL = 60;

const key = {
  one: (id: string) => `cache:users:${id}`,
  list: (cursor: string, limit: number) =>
    `cache:users:list:${cursor}:${limit}`,
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { limit = 10, cursor } = pagination;
    const cacheKey = key.list(cursor ?? 'start', limit);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

  async findOne(id: string) {
    const cacheKey = key.one(id);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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

    if (!user) throw new NotFoundException('User not found');

    await this.cache.set(cacheKey, user, CACHE_TTL);
    return user;
  }

  async update(id: string, requesterId: string, dto: UserDto) {
    if (id !== requesterId)
      throw new ForbiddenException('Cannot update another user');

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

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
}
