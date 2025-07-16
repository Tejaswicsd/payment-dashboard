import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard'; // ✅ correct path



import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard) // ❗ Remove this if you want to allow public registration
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: Partial<User>) {
    return this.usersService.create(createUserDto);
  }
}
