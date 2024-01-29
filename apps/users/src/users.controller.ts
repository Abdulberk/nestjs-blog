import { Controller, Get, UseGuards, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'apps/auth/src/guards/local-auth.guard';
import { User } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Get('/get-user/:id')
  async getUser(@Param('id') id: string, @Req() req) {
    const user: User = req.user;
    return this.usersService.getUserById(id, user);
  }
}
