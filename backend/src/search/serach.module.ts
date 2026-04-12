import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(q: string, limit = 10, cursor?: string) {
    if (!q || q.trim() === '') {
      return {
        users: { results: [], next_cursor: null },
        audio: { results: [], next_cursor: null },
      };
    }

    const [users, audio] = await Promise.all([
      this.searchUsers(q, limit, cursor),
      this.searchAudio(q, limit, cursor),
    ]);

    return { users, audio };
  }

  private async searchUsers(q: string, limit: number, cursor?: string) {
    const results = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
        ],
        ...(cursor && { id: { gt: cursor } }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    return this.paginate(results, limit, ['id', 'name', 'email', 'createdAt']);
  }

  private async searchAudio(q: string, limit: number, cursor?: string) {
    const results = await this.prisma.audio.findMany({
      where: {
        title: { contains: q, mode: 'insensitive' },
        ...(cursor && { id: { gt: cursor } }),
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    return this.paginate(results, limit, ['id', 'title', 'createdAt']);
  }

  private paginate(results: any[], limit: number, fields: string[]) {
    const hasMore = results.length > limit;
    const items = hasMore ? results.slice(0, limit) : results;
    const cleaned = items.map((item) =>
      fields.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {}),
    );

    return {
      results: cleaned,
      next_cursor: hasMore ? items[items.length - 1]['id'] : null,
    };
  }
}
