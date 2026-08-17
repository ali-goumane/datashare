import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth') @Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('register') register(@Body() dto: AuthDto) { return this.auth.register(dto); }
  @Post('login') @Throttle({ default: { limit: 5, ttl: 60000 } }) login(@Body() dto: AuthDto) { return this.auth.login(dto); }
  @Get('me') @ApiBearerAuth() @UseGuards(JwtAuthGuard) me(@Req() req: Request & { user: { userId: number; email: string; createdAt: Date; updatedAt: Date } }) {
    const user = req.user; return { userId: user.userId, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
}
