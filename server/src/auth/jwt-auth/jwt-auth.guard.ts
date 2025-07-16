import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🔍 JWT Guard - Request URL:', request.url);
    console.log('🔍 JWT Guard - Request method:', request.method);
    console.log('🔍 JWT Guard - Authorization header:', request.headers.authorization);
   
    // Check if authorization header exists
    if (!request.headers.authorization) {
      console.log('❌ JWT Guard - No authorization header');
      throw new UnauthorizedException('No authorization header provided');
    }

    // Check if authorization header is properly formatted
    const authHeader = request.headers.authorization;
    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ JWT Guard - Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format');
    }

    // Extract and validate token
    const token = authHeader.split(' ')[1];
    if (!token || token === 'null' || token === 'undefined') {
      console.log('❌ JWT Guard - Invalid or null token');
      throw new UnauthorizedException('Invalid or missing token');
    }

    console.log('🔍 JWT Guard - Token (first 20 chars):', token?.substring(0, 20) + '...');
   
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('🔍 JWT Guard - HandleRequest called');
    console.log('🔍 JWT Guard - Error:', err);
    console.log('🔍 JWT Guard - User:', user);
    console.log('🔍 JWT Guard - Info:', info);
   
    if (err || !user) {
      console.log('❌ JWT Guard - Authentication failed');
      
      // Provide specific error messages
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token format');
      }
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (info && info.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token not active yet');
      }
      
      throw err || new UnauthorizedException('Authentication failed');
    }
   
    console.log('✅ JWT Guard - Authentication successful');
    return user;
  }
}
