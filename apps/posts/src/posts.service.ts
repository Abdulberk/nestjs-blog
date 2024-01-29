import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import mongoose from 'mongoose';
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    return this.postsRepository.create({
      ...createPostDto,
      timestamp: new Date(),
      user: new mongoose.Types.ObjectId(userId),
    });
  }

  async findAll() {
    return this.postsRepository.find({});
  }

  async findOne(_id: string) {
    return this.postsRepository.findOne({ _id });
  }

  async update(_id: string, updatePostDto: UpdatePostDto) {
    return this.postsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updatePostDto,
      },
    );
  }

  async remove(_id: string) {
    return this.postsRepository.findOneAndDelete({ _id });
  }
}
