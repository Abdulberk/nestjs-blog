import { AbstractDocument } from '@app/common';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema({ versionKey: false })
export class User extends AbstractDocument {
  @Prop()
  timestamp: Date;
  @Prop({
    type: String,
    required: true,
    unique: true,
    min: 8,
    max: 255,
  })
  email: string;
  @Prop({
    type: String,
    required: true,
    min: 6,
  })
  password: string;
  @Prop({
    type: String,
    required: false,
  })
  firstName: string;
  @Prop({
    type: String,
    required: false,
  })
  lastName: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  posts: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
