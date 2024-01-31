import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comment } from './models/comment.schema';
import { User } from 'apps/users/src/models/user.schema';
import { PostsService } from 'apps/posts/src/posts.service';

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
        throw new NotFoundException('Comment could not be added !');
      }

      const postUpdateWithCommnet =
        await this.postsService.updatePostWithComment(postId, comment._id);

      if (!postUpdateWithCommnet) {
        throw new Error('Post could not be updated with comment !');
      }
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new Error(error.message);
      }
    }
  }
}
