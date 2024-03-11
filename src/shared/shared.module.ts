import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env', load: [configuration] }),
    PrismaModule,
    HttpModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [ConfigModule],
})
export class SharedModule {}
