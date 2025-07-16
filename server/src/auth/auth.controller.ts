// auth.controller.ts - Add this test endpoint
import { Controller, Post, Body, Get, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    console.log('🔍 AuthController - Login attempt:', loginDto.username);
    
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      console.log('❌ AuthController - Invalid credentials');
      return { message: 'Invalid credentials' };
    }
    
    const result = await this.authService.login(user);
    console.log('✅ AuthController - Login successful');
    return result;
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  // 🔧 Test endpoint to verify JWT tokens
  @Get('test-token')
  async testToken(@Headers('authorization') authHeader: string) {
    console.log('🔍 Test Token - Auth header:', authHeader);
    
    if (!authHeader) {
      return { error: 'No authorization header' };
    }
    
    const token = authHeader.split(' ')[1];
    console.log('🔍 Test Token - Token (first 50 chars):', token.substring(0, 50) + '...');
    
    try {
      const decoded = this.jwtService.verify(token);
      console.log('✅ Test Token - Verification successful:', decoded);
      return { valid: true, payload: decoded };
    } catch (error) {
      console.log('❌ Test Token - Verification failed:', error.message);
      return { valid: false, error: error.message };
    }
  }

  // 🔧 Test endpoint with JWT guard
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute(@Request() req) {
    console.log('🔍 Protected Route - User:', req.user);
    return { message: 'Access granted', user: req.user };
  }
}