import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(userId: string) {
    await this.findUserOrFail(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { subscription_status: SubscriptionStatus.PAID },
      select: {
        id: true,
        email: true,
        display_name: true,
        subscription_status: true,
      },
    });
  }

  async cancel(userId: string) {
    await this.findUserOrFail(userId);

    return this.prisma.user.update({
      where: { id: userId },
      data: { subscription_status: SubscriptionStatus.FREE },
      select: {
        id: true,
        email: true,
        display_name: true,
        subscription_status: true,
      },
    });
  }

  async getStatus(userId: string) {
    return this.findUserOrFail(userId);
  }

  private async findUserOrFail(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        display_name: true,
        subscription_status: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
