import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Orkestrya API')
    .setDescription('API for managing agents')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Agent API rodando em http://localhost:3000');
  console.log('📋 Agents disponíveis: GET  http://localhost:3000/agents');
  console.log('💬 Chat stream:        POST http://localhost:3000/chat/stream');
}
bootstrap();
