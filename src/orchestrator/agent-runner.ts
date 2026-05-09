import { Injectable } from '@nestjs/common';

import { AgentsService } from '../agents/agents.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class AgentRunner {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly llmService: LlmService,
  ) {}

  async run({
    agentSlug,
    input,
    onToken,
    onDone,
  }: any) {
    const agent =
      this.agentsService.findOne(agentSlug);

    const messages = [
      {
        role: 'system',
        content:
          agent.prompts?.system,
      },

      {
        role: 'user',
        content: input,
      },
    ];

    await this.llmService.stream({
      model: agent.model.name,
      temperature:
        agent.model.temperature,
      maxTokens:
        agent.model.maxTokens,

      messages,

      onToken,
    });

    onDone({
      agent: agent.identity.name,
    });
  }
}