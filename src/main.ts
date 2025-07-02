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
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT no formato: Bearer <token>'
      },
      'JWT-auth'
    )
    .setDescription(
      'A **AgroTech API** é uma plataforma voltada para o gerenciamento de agricultores, fazendas e plantações. ' +
      'Usuários podem se cadastrar como agricultores, registrar suas propriedades rurais e acompanhar suas plantações em tempo real.\n\n' +
      'Este sistema é autenticado via JWT e permite operações seguras de cadastro, consulta, atualização e exclusão de dados relacionados ao agronegócio.'
    )
    .setVersion('1.0')
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
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
