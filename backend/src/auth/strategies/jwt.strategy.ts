import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    const secret = process.env.JWT_REFRESH_SECRET;
    console.log('🔑 secret length:', secret?.length);
    const jwt = require('jsonwebtoken');
    const testToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzN2UxOWM0NC04ZTRkLTQ4MGEtYjkyMC1jMDI5ZjNiOTRhZjkiLCJlbWFpbCI6InByYW5hYkBnbWFpbC5jb20iLCJpYXQiOjE3NzYwMTYwNDIsImV4cCI6MTc3NjYyMDg0Mn0.aEFv3htb5Z_DskK_PFw2V2nzys7WUNs7DDdahQTYbDk';
    try {
      const decoded = jwt.verify(testToken, secret);
      console.log('✅ token valid:', decoded);
    } catch (err) {
      console.log('❌ token error:', err.message);
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException();

    const { password, refreshToken, ...result } = user;
    return result;
  }
}
