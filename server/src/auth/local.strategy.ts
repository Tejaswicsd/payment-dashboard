// local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('LocalStrategy - Attempting to validate:', username);
    
    const user = await this.authService.validateUser(username, password);
    
    if (!user) {
      console.log('LocalStrategy - Validation failed for:', username);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    console.log('LocalStrategy - Validation successful for:', username);
    return user;
  }
}