import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { MailService } from '../shared/mail/mail.service';
import { RedisModule } from '@nestjs-modules/ioredis';

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
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, ConfigService],
})
export class AuthModule {}
