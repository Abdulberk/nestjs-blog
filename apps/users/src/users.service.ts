import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common';
import { User } from './models/user.schema';
import { Post } from 'apps/posts/src/models/post.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
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

  async updateUserPosts(userId: string, postId: string): Promise<boolean> {
    const filterQuery = {
      _id: userId,
    };

    try {
      await this.usersRepository.updateOne(filterQuery, {
        $push: { posts: postId },
      });

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id: string, user: User): Promise<User> {
    if (id !== user._id.toString()) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await this.usersRepository.findOne({ _id: id });
  }

  async deleteUserPost(userId: User['_id'], postId: string): Promise<boolean> {
    try {
      const postRemovedFromUser = await this.usersRepository.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { posts: postId },
        },
      );

      if (!postRemovedFromUser) {
        throw new Error('Post could not be removed from user');
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
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
