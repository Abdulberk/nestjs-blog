import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateUserDto {
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
