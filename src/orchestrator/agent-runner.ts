import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentsService } from '../agents/agents.service';
import { LlmService } from '../llm/llm.service';
import { ToolExecutor } from './tool-executor';
import { PromptBuilder } from './prompt-builder';
import { ResponseAggregator } from './response-aggregator';

export interface AgentRunnerInput {
  agentSlug: string;
  input: string;
  onToken: (token: string) => void;
  onDone: (result: any) => void;
  onError?: (error: string) => void;
}

@Injectable()
export class AgentRunner {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly llmService: LlmService,
    private readonly toolExecutor: ToolExecutor,
    private readonly promptBuilder: PromptBuilder,
    private readonly responseAggregator: ResponseAggregator,
  ) {}

  async run(input: AgentRunnerInput) {
    this.responseAggregator.reset();

    try {
      const agent = this.agentsService.findOne(input.agentSlug);

      // Build consistent prompt
      const messages = this.promptBuilder.buildMessages(agent, input.input);

      // Stream from LLM
      await this.llmService.stream({
        model: agent.model.name,
        messages,
        temperature: agent.model.temperature ?? 0.7,
        max_tokens: agent.model.maxTokens ?? 1000,
        onToken: (token: string) => {
          this.responseAggregator.addToken(token);
          input.onToken(token);
        },
        onStart: () => {
          // Could emit start event
        },
        onEnd: () => {
          // Could emit end event
        },
        onError: (error: string) => {
          this.responseAggregator.addError(error);
          input.onError?.(error);
        },
      });

      // Aggregate final response
      const response = this.responseAggregator.getResponse();

      input.onDone({
        agent: {
          slug: agent.slug,
          name: agent.identity.name,
        },
        response: {
          content: response.content,
          tokenCount: response.tokens.length,
          characterCount: response.content.length,
        },
        metadata: {
          temperature: agent.model.temperature,
          maxTokens: agent.model.maxTokens,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof NotFoundException
          ? `Agent "${input.agentSlug}" not found`
          : error instanceof Error
            ? error.message
            : 'Unknown error';

      input.onError?.(errorMessage);

      input.onDone({
        error: errorMessage,
        status: 'failed',
      });
    }
  }
}
