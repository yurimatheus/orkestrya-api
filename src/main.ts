import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Agent API rodando em http://localhost:3000');
  console.log('📋 Agents disponíveis: GET  http://localhost:3000/agents');
  console.log('💬 Chat stream:        POST http://localhost:3000/chat/stream');
}
bootstrap();
