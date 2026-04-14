import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/infrastructure/redis/cache.service';
import { UserDto } from './dto/user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly CACHE_TTL = 60;

  private readonly key = {
    one: (id: string) => `cache:users:${id}`,
    list: (cursor: string, limit: number) =>
      `cache:users:list:${cursor}:${limit}`,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { limit = 10, cursor } = pagination;
    const cacheKey = this.key.list(cursor ?? 'start', limit);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    try {
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

      await this.cache.set(cacheKey, result, this.CACHE_TTL);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    const cacheKey = this.key.one(id);

    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    try {
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

      await this.cache.set(cacheKey, user, this.CACHE_TTL);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, requesterId: string, dto: UserDto) {
    if (id !== requesterId)
      throw new ForbiddenException('Cannot update another user');

    try {
      const userExist = await this.prisma.user.findUnique({ where: { id } });
      if (!userExist) throw new NotFoundException('User not found');

      const user = await this.prisma.user.update({
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

      await this.cache.del(this.key.one(id));
      await this.cache.delByPattern('cache:users:list:*');

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async invalidateUserCache(userId: string) {
    await this.cache.del(this.key.one(userId));
  }
}
