import { AbstractDocument } from '@app/common';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Post extends AbstractDocument {
  @Prop({
    type: String,
    required: true,
    min: 8,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
    min: 20,
  })
  content: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  })
  comments: mongoose.Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
