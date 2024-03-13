import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [AuthModule, UserModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
