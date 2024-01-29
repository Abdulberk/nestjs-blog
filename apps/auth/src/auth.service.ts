import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'apps/users/src/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from 'apps/users/src/models/user.schema';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from 'apps/users/src/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.verifyUser(email, password);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: LoginUserDto, response: Response): Promise<any> {
    try {
      const payload = { email: user.email, sub: user._id };
      const expiresIn = await this.configService.get('JWT_EXPIRATION');
      const accessToken = this.jwtService.sign(payload);

      response.cookie('Authentication', accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + expiresIn * 1000),
      });

      return response.json({
        message: 'Login successful',
        user,
        success: true,
      });
    } catch (error) {
      throw new Error(error.message || 'Login failed !');
    }
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      if (user) {
        return {
          message: 'Registration successful !',
          user,
          success: true,
        };
      }
    } catch (error) {
      throw new Error(error.message || 'User registration failed !');
    }
  }
}
