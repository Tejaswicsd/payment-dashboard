import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ Validate user for login
  async validateUser(username: string, password: string): Promise<any> {
    console.log('🔍 AuthService - Validating user:', username);
    
    const user = await this.usersService.findByUsername(username);
    console.log('🔍 AuthService - User found:', !!user);
    
    if (!user) {
      console.log('❌ AuthService - No user found');
      return null;
    }

    // ✅ Compare password with stored hash
    const passwordValid = await bcrypt.compare(password, user.password);
    console.log('🔍 AuthService - Password valid:', passwordValid);
    
    if (!passwordValid) {
      console.log('❌ AuthService - Password invalid');
      return null;
    }

    // Return user without password
    const { password: _, ...result } = user;
    console.log('✅ AuthService - User validated successfully');
    return result;
  }

  // ✅ Login method with proper JWT signing
  async login(user: any) {
    console.log('🔍 AuthService - Login called with user:', user);
    
    // Create JWT payload
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    
    };
    
    console.log('🔍 AuthService - JWT payload:', payload);
    
    try {
      // Sign the token using the configured secret
      const token = this.jwtService.sign(payload);
      console.log('🔍 AuthService - Generated token (first 50 chars):', token.substring(0, 50) + '...');
      
      // Verify the token immediately to ensure it works
      const decoded = this.jwtService.verify(token);
      console.log('✅ AuthService - Token verification successful:', decoded);
      
      return {
        access_token: token,
        token: token, // For frontend compatibility
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.log('❌ AuthService - Token generation/verification failed:', error.message);
      throw new Error('Failed to generate authentication token');
    }
  }

  // ✅ Register new user
  async register(data: any) {
    console.log('🔍 AuthService - Register called with data:', { ...data, password: '[HIDDEN]' });
    
    // Hash the password before creating user
    const hashedPassword = await this.hashPassword(data.password);
    const userData = { ...data, password: hashedPassword };
    
    const user = await this.usersService.create(userData);
    console.log('✅ AuthService - User created successfully');
    
    return this.login(user);
  }

  // ✅ Helper method to hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('🔍 AuthService - Password hashed successfully');
    return hash;
  }

  // ✅ Helper method to verify JWT token (for debugging)
  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      console.log('✅ AuthService - Token verified:', decoded);
      return decoded;
    } catch (error) {
      console.log('❌ AuthService - Token verification failed:', error.message);
      throw error;
    }
  }
}