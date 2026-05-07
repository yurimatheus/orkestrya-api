import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('🚀 Agent API rodando em http://localhost:3000');
  console.log('📋 Agents disponíveis: GET  http://localhost:3000/agents');
  console.log('💬 Chat stream:        POST http://localhost:3000/chat/stream');
}
bootstrap();
