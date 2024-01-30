import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

import mongoose from 'mongoose';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content: string;

  @IsOptional()
  user: mongoose.Types.ObjectId;

  @IsOptional()
  comments: mongoose.Types.ObjectId[];
}
