import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './models/comment.schema';

@Injectable()
export class CommentsRepository extends AbstractRepository<Comment> {
  protected readonly logger = new Logger(CommentsRepository.name);

  constructor(@InjectModel(Comment.name) commentModel: Model<Comment>) {
    super(commentModel);
  }
}
