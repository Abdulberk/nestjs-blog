import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '@app/common';
import { PostsRepository } from './posts.repository';
import { Post, PostSchema } from './models/post.schema';
import { UsersService } from 'apps/users/src/users.service';
import { UsersModule } from 'apps/users/src/users.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, UsersService],
  exports: [PostsService, PostsRepository],
})
export class PostsModule {}
