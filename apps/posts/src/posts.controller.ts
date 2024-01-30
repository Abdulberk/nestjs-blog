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
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'apps/users/src/models/user.schema';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create-post')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId: User['_id'] = req?.user?.id;
    console.log('userId in: ' + userId);
    return await this.postsService.create(createPostDto, userId);
  }

  @Get('/my-posts')
  getAllPosts(
    @Req() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId: User['_id'] = req?.user?.id;
    page = page || 1;
    limit = limit || 10;
    return this.postsService.findAll(userId, page, limit);
  }

  @Get(':id')
  getOnePost(@Param('id') id: string, @Req() req) {
    const userId: User['_id'] = req?.user?.id;
    return this.postsService.findOne(id, userId);
  }

  @Patch(':id')
  updateOnePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updateOnePost(id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
