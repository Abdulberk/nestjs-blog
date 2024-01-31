import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './models/comment.schema';
import { User } from 'apps/users/src/models/user.schema';
import { PostsService } from 'apps/posts/src/posts.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsService,
  ) {}

  async addComment(
    postId: Comment['_id'],
    userId: User['_id'],
    addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    try {
      const comment = await this.commentsRepository.create({
        ...addCommentDto,
        commentor: userId,
        commentOf: postId,
      });

      if (!comment) {
        throw new BadRequestException('Comment could not be created !');
      }

      const postUpdateWithCommnet =
        await this.postsService.updatePostWithComment(postId, comment._id);

      if (!postUpdateWithCommnet) {
        throw new BadRequestException('Post update with comment failed !');
      }
      return comment;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }

  async updateComment(
    userId: User['_id'],
    commentId: Comment['_id'],
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    try {
      const filterQuery: FilterQuery<Comment> = {
        _id: commentId,
        commentor: userId,
      };

      const commentUpdated = await this.commentsRepository.findOneAndUpdate(
        filterQuery,
        updateCommentDto,
      );

      if (!commentUpdated) {
        throw new NotFoundException(
          'Document was not found ! You are either not the owner of the document or the document does not exist !',
        );
      }

      return commentUpdated;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}
