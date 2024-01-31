import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

import mongoose from 'mongoose';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  comment: string;

  @IsOptional()
  commentOf: mongoose.Types.ObjectId;

  @IsOptional()
  commentor: mongoose.Types.ObjectId;
}
