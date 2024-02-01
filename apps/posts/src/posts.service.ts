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
import PostDeleted from './interface/delete-post.guard';
import { QueryOptionsDto } from './dto/query-options.dto';
import { BadRequestException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    try {
      const createdPost = await this.postsRepository.create({
        ...createPostDto,
        user: new Types.ObjectId(userId),
      });

      const createdPostId = createdPost._id.toString();
      const fieldsUpdated = await this.usersService.updateUserPosts(
        userId,
        createdPostId,
      );

      if (!fieldsUpdated) {
        throw new BadRequestException('Post creation failed !');
      }

      return createdPost;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchText(searchQuery: string): Promise<Post[]> {
    try {
      const posts = await this.postsRepository.searchText(searchQuery);

      if (!posts || posts.length === 0) {
        throw new NotFoundException(`No posts found for ${searchQuery}`);
      }

      return posts;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(error.message);
    }
  }

  async findAll(
    userId: User['_id'],
    queryOptionsDto: QueryOptionsDto,
  ): Promise<Post[]> {
    try {
      const { page = 1, limit = 10 } = queryOptionsDto;
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
      }
      throw new Error(error.message);
    }
  }

  async findOne(postId: string, userId: string): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ _id: postId });
      if (!post) {
        throw new NotFoundException('Post not found !');
      }
      if (post.user.toString() !== userId.toString()) {
        throw new UnauthorizedException('Unauthorized access !');
      }

      return post;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePostWithComment(
    postId: Types.ObjectId,
    commentId: Types.ObjectId,
  ): Promise<boolean> {
    const updatedPost = await this.postsRepository.updatePostWithComment(
      postId,
      commentId,
    );
    if (!updatedPost) {
      throw new BadRequestException('Post update with comment failed !');
    }

    return updatedPost;
  }

  async updateOnePost(
    _id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    try {
      const post = await this.postsRepository.findOne({ _id });

      if (!post) {
        throw new NotFoundException('Post not found !');
      }

      const updatedPost = await this.postsRepository.findOneAndUpdate(
        { _id },
        {
          $set: updatePostDto,
        },
      );

      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(error.message);
    }
  }

  async deletePost(id: string, userId: string): Promise<PostDeleted> {
    try {
      const filterQuery: FilterQuery<Post> = {
        _id: new Types.ObjectId(id),
        user: new Types.ObjectId(userId),
      };

      const existingPost = await this.postsRepository.findOne(filterQuery);

      if (!existingPost) {
        throw new NotFoundException('Post not found !');
      }

      const deletedPost = await this.postsRepository.delete(filterQuery);

      if (!deletedPost) {
        throw new BadRequestException('Post delete failed !');
      }

      return {
        id,
        message: 'Post deleted successfully !',
        success: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new Error(error.message);
    }
  }
}
