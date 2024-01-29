import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { User } from './models/user.schema';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      timestamp: new Date(),
    });
  }

  async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      return;
    }

    throw new UnprocessableEntityException('Email already exists');
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
