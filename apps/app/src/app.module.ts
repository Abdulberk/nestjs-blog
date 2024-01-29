import { Module } from '@nestjs/common';
import { PostsModule } from 'apps/posts/src/posts.module';
import { AuthModule } from 'apps/auth/src/auth.module';
import { CommentsModule } from 'apps/comments/src/comments.module';
import { LoggerModule } from '@app/common';

@Module({
  imports: [PostsModule, AuthModule, CommentsModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
