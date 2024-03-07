import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('jwt'),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
