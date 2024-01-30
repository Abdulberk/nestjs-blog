import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Post } from './models/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(@InjectModel(Post.name) postModel: Model<Post>) {
    super(postModel);
  }

  async getAllPostsPagination(
    userId: Post['user'],
    page: number,
    limit: number,
  ): Promise<Post[]> {
    const skip = (page - 1) * limit;

    const result = await this.model
      .find({ user: userId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return result;
  }
}
