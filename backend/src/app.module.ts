import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RateLimitGuard } from './common/RateLimitGuard';
import { UsersModule } from './user/user.module';
import { AudioModule } from './audio/audio.module';
import { PromptsModule } from './prompt/prompt.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    RedisModule,
    PrismaModule,
    AuthModule,
    SubscriptionModule,
    UsersModule,
    AudioModule,
    PromptsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useFactory: (guard: RateLimitGuard) => guard,
      inject: [RateLimitGuard],
    },
    RateLimitGuard,
  ],
})
export class AppModule {}
