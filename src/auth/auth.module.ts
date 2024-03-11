import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { GithubStrategy } from '../shared/github/github.strategy';
import { MailService } from '../shared/mail/mail.service';

@Module({
  imports: [
    // jwt
    JwtModule.registerAsync({
      global: true,
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
    // 连接redis
    RedisModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('redis'),
    }),
    // github登录
    PassportModule.register({ defaultStrategy: 'github' }),
    // Http axios
    HttpModule.registerAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('http'),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, ConfigService, GithubStrategy],
})
export class AuthModule {}
