import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import OpenAI from 'openai';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class ChatService {
  private client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  constructor(private agentsService: AgentsService) {}

  async streamMessage(agentSlug: string, message: string, res: FastifyReply) {
    const agent = this.agentsService.findOne(agentSlug);

    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');
    res.header('Connection', 'keep-alive');
    res.header('Access-Control-Allow-Origin', '*');

    const send = (data: object) => res.raw.write(`data: ${JSON.stringify(data)}\n\n`);

    try {
      const stream = await this.client.chat.completions.create({
        model: agent.model.provider === 'openai' ? `gpt-${agent.model.name}` : agent.model.name,
        temperature: agent.model.temperature ?? 0.7,
        max_tokens: agent.model.maxTokens ?? 1000,
        messages: [
          { role: 'system', content: agent.prompts?.system || 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        if (token) send({ type: 'token', content: token });
      }

      send({ type: 'done', agent: agent.identity.name, model: agent.model });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred while processing the message.';
      send({ type: 'error', content: message });
    } finally {
      send({ type: 'end' });
    }
  }
}