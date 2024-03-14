import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, UserModule, TagModule, CategoryModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
