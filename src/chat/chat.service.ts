import { Injectable } from '@nestjs/common';
import type { Response } from 'express';
import OpenAI from 'openai';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class ChatService {
  private client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  constructor(private agentsService: AgentsService) {}

  async streamMessage(agentSlug: string, message: string, res: Response) {
    const agent = this.agentsService.findOne(agentSlug);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

    try {
      const stream = await this.client.chat.completions.create({
        model: agent.model,
        temperature: agent.temperature ?? 0.7,
        max_tokens: agent.maxTokens ?? 1000,
        messages: [
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: message },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || '';
        if (token) send({ type: 'token', content: token });
      }

      send({ type: 'done', agent: agent.name, model: agent.model });
    } catch (error) {
      send({ type: 'error', content: error.message });
    } finally {
      res.end();
    }
  }
}