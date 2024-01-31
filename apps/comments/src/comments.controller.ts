import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Req,
  UseGuards,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'apps/auth/src/guards/jwt-auth.guard';
import { IdValidationGuard } from 'apps/posts/src/guards/id-validation.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import mongoose from 'mongoose';

@UseGuards(JwtAuthGuard, IdValidationGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/add-comment/:postId')
  async addComment(
    @Req() req,
    @Param('postId') postId: mongoose.Types.ObjectId,
    @Body() addCommentDto: AddCommentDto,
  ) {
    const userId: mongoose.Types.ObjectId = req?.user?.id;

    return await this.commentsService.addComment(postId, userId, addCommentDto);
  }
}
