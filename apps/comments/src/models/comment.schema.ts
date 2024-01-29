import { AbstractDocument } from '@app/common';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'apps/posts/src/models/post.schema';
import { User } from 'apps/users/src/models/user.schema';

@Schema({ versionKey: false })
export class Comment extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop({
    type: String,
    required: true,
    min: 8,
  })
  comment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  })
  commentOf: Post;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  commentor: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
