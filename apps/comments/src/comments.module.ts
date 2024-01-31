import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { DatabaseModule } from '@app/common';
import { Comment, CommentSchema } from './models/comment.schema';
import { CommentsRepository } from './comments.repository';
import { PostsModule } from 'apps/posts/src/posts.module';

@Module({
  imports: [
    PostsModule,
    DatabaseModule,
    DatabaseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
