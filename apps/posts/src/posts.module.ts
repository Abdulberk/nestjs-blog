import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '@app/common';
import { PostsRepository } from './posts.repository';
import { Post, PostSchema } from './models/post.schema';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
})
export class PostsModule {}
