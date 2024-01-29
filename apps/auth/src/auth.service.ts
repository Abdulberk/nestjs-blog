import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'apps/users/src/users.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from 'apps/users/src/models/user.schema';
import { LoginUserDto } from './dto/login.dto';

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
    console.log('auth service validateUser email: ' + email);
    console.log('auth service validateUser password: ' + password);

    const user = await this.usersService.verifyUser(email, password);
    console.log('check line');

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: LoginUserDto, response: Response): Promise<any> {
    console.log('auth service login user: ' + JSON.stringify(user));
    const payload = { email: user.email, sub: user._id };
    const expiresIn = await this.configService.get('JWT_EXPIRATION');
    const accessToken = this.jwtService.sign(payload);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + expiresIn * 1000),
    });
  }

  async register(req): Promise<any> {
    const hashedPassword = await bcrypt.hash(req.password, 10);

    const user = await this.usersService.createUser({
      ...req,
      password: hashedPassword,
    });

    return user;
  }
}
