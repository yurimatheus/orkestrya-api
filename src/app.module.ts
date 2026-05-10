import { Module } from '@nestjs/common';
import { AgentsModule } from './agents/agents.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    AgentsModule,
    ChatModule,
    PrismaModule,
    ArticlesModule,
  ],
})
export class AppModule {}
