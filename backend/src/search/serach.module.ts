import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
    try {
      const cursorFilter = cursor
        ? Prisma.sql`AND u.id < ${cursor}`
        : Prisma.empty;

      const results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          name: string;
          email: string;
          createdAt: Date;
          score: number;
        }>
      >(Prisma.sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u."createdAt",
          ts_rank(
            to_tsvector('english', coalesce(u.name, '') || ' ' || coalesce(u.email, '')),
            plainto_tsquery('english', ${q})
          ) +
          CASE WHEN lower(u.name)  = lower(${q}) THEN 1.0 ELSE 0 END +
          CASE WHEN lower(u.email) = lower(${q}) THEN 1.0 ELSE 0 END +
          CASE WHEN lower(u.name)  LIKE lower(${q + '%'}) THEN 0.5 ELSE 0 END +
          CASE WHEN lower(u.email) LIKE lower(${q + '%'}) THEN 0.5 ELSE 0 END
          AS score
        FROM users u
        WHERE (
          u.name  ILIKE ${'%' + q + '%'}
          OR u.email ILIKE ${'%' + q + '%'}
        )
        ${cursorFilter}
        ORDER BY score DESC, u."createdAt" DESC
        LIMIT ${limit + 1}
      `);

      return this.paginate(results, limit, [
        'id',
        'name',
        'email',
        'createdAt',
      ]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async searchAudio(q: string, limit: number, cursor?: string) {
    try {
      const cursorFilter = cursor
        ? Prisma.sql`AND a.id < ${cursor}`
        : Prisma.empty;

      const results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          createdAt: Date;
          score: number;
        }>
      >(Prisma.sql`
        SELECT
          a.id,
          a.title,
          a."createdAt",
          ts_rank(
            to_tsvector('english', coalesce(a.title, '')),
            plainto_tsquery('english', ${q})
          ) +
          CASE WHEN lower(a.title) = lower(${q})         THEN 1.0 ELSE 0 END +
          CASE WHEN lower(a.title) LIKE lower(${q + '%'}) THEN 0.5 ELSE 0 END
          AS score
        FROM audios a
        WHERE a.title ILIKE ${'%' + q + '%'}
        ${cursorFilter}
        ORDER BY score DESC, a."createdAt" DESC
        LIMIT ${limit + 1}
      `);

      return this.paginate(results, limit, ['id', 'title', 'createdAt']);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
