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
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { IdValidationGuard } from './guards/id-validation.guard';
import { Types } from 'mongoose';
import { QueryOptionsDto } from './dto/query-options.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create-post')
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req) {
    const userId = req?.user?.id;
    console.log('userId in: ' + userId);
    return await this.postsService.create(createPostDto, userId);
  }

  @Get('/my-posts')
  async getAllPosts(@Req() req, @Query() queryOptionsDto: QueryOptionsDto) {
    const userId: Types.ObjectId = req?.user?.id;
    return await this.postsService.findAll(userId, queryOptionsDto);
  }

  @UseGuards(IdValidationGuard)
  @Get('post/:id')
  async getOnePost(@Param('id') id: string, @Req() req) {
    const userId = req?.user?.id;
    return await this.postsService.findOne(id, userId);
  }

  @UseGuards(IdValidationGuard)
  @Patch('update-post/:id')
  async updateOnePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updateOnePost(id, updatePostDto);
  }

  @UseGuards(IdValidationGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Req() req) {
    const userId = req?.user?.id;
    return await this.postsService.deletePost(id, userId);
  }

  @Get('/search')
  async searchText(@Query('query') query: string) {
    return await this.postsService.searchText(query);
  }
}
