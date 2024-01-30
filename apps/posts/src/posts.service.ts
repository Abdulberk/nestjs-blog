import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { User } from 'apps/users/src/models/user.schema';
import { UsersService } from 'apps/users/src/users.service';
@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto, userId: User['_id']) {
    console.log('create post dto: ' + JSON.stringify(createPostDto));
    console.log('userId: ' + userId);
    try {
      const createdPost = await this.postsRepository.create({
        ...createPostDto,
        user: userId,
      });

      await this.usersService.updateUserPosts(userId, createdPost._id);
      return createdPost;
    } catch (error) {
      throw new Error(error.message);
    }
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
