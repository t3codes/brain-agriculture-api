import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/logger.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Seu API Title')
    .setDescription('Descrição da sua API')
    .setVersion('1.0')
    .addBearerAuth() // Se usar autenticação JWT
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 'api-docs' é o endpoint da documentação
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
