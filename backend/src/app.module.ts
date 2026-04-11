import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { RedisModule } from './infrastructure/redis/redis.module'; // ← remove REDIS_CLIENT import
import { RateLimitGuard } from './common/RateLimitGuard';
import { UsersModule } from './user/user.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    RedisModule,
    PrismaModule,
    AuthModule,
    SubscriptionModule,
    UsersModule,
    AudioModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (guard: RateLimitGuard) => guard, // ← reuse instance from RedisModule
      inject: [RateLimitGuard], // ← NestJS pulls the already-resolved one
    },
  ],
})
export class AppModule {}
