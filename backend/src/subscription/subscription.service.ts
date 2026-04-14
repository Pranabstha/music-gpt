import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
  ) {}

  async subscribe(userId: string) {
    await this.user.findOne(userId);
    return this.prisma.user.update({
      where: { id: userId },
      data: { subscription_status: SubscriptionStatus.PAID },
      select: {
        id: true,
        email: true,
        name: true,
        subscription_status: true,
      },
    });
  }

  async cancel(userId: string) {
    await this.user.findOne(userId);

    try {
      return this.prisma.user.update({
        where: { id: userId },
        data: { subscription_status: SubscriptionStatus.FREE },
        select: {
          id: true,
          email: true,
          name: true,
          subscription_status: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getStatus(userId: string) {
    this.user.invalidateUserCache(userId);
    return this.user.findOne(userId);
  }
}
