import {
  Controller,
  Post,
  Patch,
  Req,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { IdValidationGuard } from 'apps/posts/src/guards/id-validation.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Types } from 'mongoose';

@UseGuards(JwtAuthGuard, IdValidationGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/add-comment/:postId')
  async addComment(
    @Req() req,
    @Param('postId') postId: Types.ObjectId,
    @Body() addCommentDto: AddCommentDto,
  ) {
    const userId: Types.ObjectId = req?.user?.id;

    return await this.commentsService.addComment(postId, userId, addCommentDto);
  }

  @Patch('/update-comment/:commentId')
  async updateComment(
    @Req() req,
    @Param('commentId') commentId: Types.ObjectId,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId: Types.ObjectId = req?.user?.id;
    return await this.commentsService.updateComment(
      userId,
      commentId,
      updateCommentDto,
    );
  }
}
