import { Injectable } from '@nestjs/common';

import { ToolExecutor } from './tool-executor';

@Injectable()
export class AgentRunner {
  constructor(
    private readonly toolExecutor: ToolExecutor,
  ) {}

  async run(agent: any, input: string, context?: any) {
    // 1. monta prompt
    const messages = [
      {
        role: 'system',
        content: agent.systemPrompt,
      },
      {
        role: 'user',
        content: input,
      },
    ];

    // 2. chama LLM
    const response = await this.callLLM(agent, messages);

    // 3. verificou tool call?
    if (response.toolCall) {
      const toolResult = await this.toolExecutor.execute(
        response.toolCall.name,
        response.toolCall.input,
        context,
      );

      // 4. manda resultado da tool pra LLM
      const finalResponse = await this.callLLM(agent, [
        ...messages,

        {
          role: 'assistant',
          content: JSON.stringify(response.toolCall),
        },

        {
          role: 'tool',
          content: JSON.stringify(toolResult),
        },
      ]);

      return finalResponse.content;
    }

    return response.content;
  }

  private async callLLM(agent: any, messages: any[]) {
    /**
     * Aqui entra:
     * OpenAI
     * Deepseek
     * Claude
     * Gemini
     * Ollama
     * etc
     */

    return {
      content: 'Resposta simulada',
    };
  }
}