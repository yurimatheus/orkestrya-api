import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { AgentsModule } from '../agents/agents.module';
import { ToolsModule } from '../tools/tools.module';

import { ToolRegistry } from './tool-registry';
import { ToolExecutor } from './tool-executor';
import { AgentRunner } from './agent-runner';
import { PromptBuilder } from './prompt-builder';
import { ResponseAggregator } from './response-aggregator';
import { ToolRegistryBootstrap } from './tool-registry-bootstrap';

@Module({
  imports: [
    LlmModule,
    AgentsModule,
    ToolsModule,
  ],

  providers: [
    ToolRegistry,
    ToolExecutor,
    AgentRunner,
    PromptBuilder,
    ResponseAggregator,
    ToolRegistryBootstrap,
  ],

  exports: [
    ToolRegistry,
    ToolExecutor,
    AgentRunner,
    PromptBuilder,
    ResponseAggregator,
  ],
})
export class OrchestratorModule {}