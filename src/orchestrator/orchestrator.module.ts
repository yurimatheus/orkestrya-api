import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';

import { ToolExecutor } from './tool-executor';
import { AgentRunner } from './agent-runner';

@Module({
  imports: [
    LlmModule,
  ],

  providers: [
    ToolExecutor,
    AgentRunner,
  ],

  exports: [
    ToolExecutor,
    AgentRunner,
  ],
})
export class OrchestratorModule {}