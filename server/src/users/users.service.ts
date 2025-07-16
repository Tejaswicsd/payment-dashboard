// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async create(userData: any): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const newUser = this.userRepository.create({
      username: userData.username,
      password: hashedPassword,
      email: userData.email || null,
      role: userData.role || UserRole.VIEWER,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async resetAdminPassword(): Promise<void> {
    const admin = await this.findByUsername('admin');
    if (admin) {
      const newHashedPassword = await bcrypt.hash('admin', 10);
      await this.userRepository.update(admin.id, { password: newHashedPassword });
      console.log('✅ Admin password reset successfully');
    } else {
      console.log('⚠️ Admin user not found');
    }
  }
}