import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [UsersModule, AuthModule, CommentsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
