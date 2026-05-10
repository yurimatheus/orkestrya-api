import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AgentsModule,
    ChatModule,
    PrismaModule,
  ],
})
export class AppModule {}
