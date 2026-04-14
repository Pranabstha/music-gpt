import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.dectors';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiBody({ type: RegisterDto })
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiCreatedResponse({ description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh a user' })
  @ApiCreatedResponse({ description: 'User refreshed successfully' })
  @ApiBody({ type: LoginDto })
  refresh(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.refresh(user.id, user.email);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout The user' })
  @ApiCreatedResponse({ description: 'User logged out successfully' })
  @HttpCode(200)
  logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user.id);
  }
}
