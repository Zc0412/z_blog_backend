import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  // 数据校验
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // 设置api prefix
  app.setGlobalPrefix('/api/v1');

  // 生成swagger
  const config = new DocumentBuilder()
    .setTitle('z blog doc')
    .setDescription('我的blog api 文档')
    .setVersion('1.0')
    .addTag('blog')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);
  await app.listen(3303);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
