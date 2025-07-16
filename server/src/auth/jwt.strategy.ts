import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log('🔍 JWT Strategy - Validating payload:', payload);
    console.log('🔍 JWT Strategy - Payload type:', typeof payload);
    console.log('🔍 JWT Strategy - Payload keys:', Object.keys(payload));
   
    if (!payload || !payload.sub) {
      console.log('❌ JWT Strategy - Invalid payload');
      throw new UnauthorizedException('Invalid token payload');
    }
   
    const user = {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      sub: payload.sub,
    };
   
    console.log('✅ JWT Strategy - Returning user:', user);
    return user;
  }
}