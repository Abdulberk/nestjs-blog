import { AbstractDocument } from '@app/common';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({ versionKey: false, timestamps: true })
export class Comment extends AbstractDocument {
  @Prop({
    type: String,
    required: true,
    min: 5,
  })
  comment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  })
  commentOf: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  commentor: mongoose.Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
