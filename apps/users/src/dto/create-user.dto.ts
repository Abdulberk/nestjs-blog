import {
  IsString,
  IsNotEmpty,
  IsDate,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateUserDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(8)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsOptional()
  posts: mongoose.Types.ObjectId[];
}
