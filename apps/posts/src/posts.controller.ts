import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'apps/users/src/models/user.schema';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-post')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId: User['_id'] = req?.user?.id;
    console.log('userId in: ' + userId);
    return await this.postsService.create(createPostDto, userId);
  }

  @Get()
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getOnePost(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  updateOnePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
