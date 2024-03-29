import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Post } from './models/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UpdateWriteOpResult } from 'mongoose';
import { QueryOptionsDto } from './dto/query-options.dto';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsRepository extends AbstractRepository<Post> {
  protected readonly logger = new Logger(PostsRepository.name);

  constructor(@InjectModel(Post.name) private postModel: Model<Post>
  ) {
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
      .populate({
        path: 'comments',
        populate: {
          path: 'commentor',
          model: 'User',
          select: '-posts -password',
        },
      })
      .exec();

    return result;
  }

  async searchText(searchText: string): Promise<Post[]> {
    const result = await this.postModel.aggregate([
      {
        $search: {
          index: 'searchIndex',
          text: {
            query: searchText,
            path: ['title', 'content'],
          },
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          user: 1,
          score: { $meta: 'searchScore' },
        },
      },
      {
        $sort: {
          score: -1,

        },
      },
    ]);

    return result;
  }

  async updatePostWithComment(
    postId: Types.ObjectId,
    commentId: Types.ObjectId,
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await this.model.updateOne(
      { _id: postId },
      { $push: { comments: commentId } },
    );

    return result.modifiedCount > 0;
  }
}
