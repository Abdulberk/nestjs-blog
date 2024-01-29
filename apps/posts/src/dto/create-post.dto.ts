import { IsString, IsNotEmpty, IsDate, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

import mongoose from 'mongoose';

export class CreatePostDto {
  @IsDate()
  @Type(() => Date)
  timestamp: Date;
  @IsString()
  @IsNotEmpty()
  @Min(8)
  title: string;
  @IsString()
  @IsNotEmpty()
  @Min(20)
  content: string;
  @IsString()
  user: mongoose.Types.ObjectId;
  @IsString()
  @IsArray()
  comments: mongoose.Types.ObjectId[];
}
