import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { User } from 'apps/users/src/models/user.schema';
import { UsersService } from 'apps/users/src/users.service';
import { Post } from './models/post.schema';
import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import PostDeleted from './interface/delete-post.interface';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto, userId: User['_id']) {
    try {
      const createdPost = await this.postsRepository.create({
        ...createPostDto,
        user: userId,
      });

      await this.usersService.updateUserPosts(userId, createdPost._id);
      return createdPost;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(
    userId: User['_id'],
    page: number,
    limit: number,
  ): Promise<Post[]> {
    try {
      const posts = await this.postsRepository.getAllPostsPagination(
        userId,
        page,
        limit,
      );

      if (!posts || posts.length === 0) {
        throw new NotFoundException('No posts found');
      }

      return posts;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async findOne(postId: string, userId: User['_id']): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ _id: postId });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      if (post.user.toString() !== userId.toString()) {
        throw new UnauthorizedException('Unauthorized access');
      }

      return post;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(_id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updatePostDto,
      },
    );
  }

  async deletePost(_id: string): Promise<PostDeleted> {
    try {
      const objectId = Types.ObjectId.isValid(_id);

      if (!objectId) {
        throw new NotFoundException('Post not found');
      }

      const post = await this.postsRepository.findOne({ _id });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      await this.postsRepository.delete({ _id });

      return {
        id: _id,
        message: 'Post deleted successfully',
        success: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}
