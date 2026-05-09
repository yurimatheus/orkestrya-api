import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AgentRunner } from '../orchestrator/agent-runner';

@Injectable()
export class ChatService {
  constructor(
    private readonly agentRunner: AgentRunner,
  ) {}

  async streamMessage(
    agentSlug: string,
    message: string,
    res: FastifyReply,
  ) {
    res.header('Content-Type', 'text/event-stream');
    res.header('Cache-Control', 'no-cache');
    res.header('Connection', 'keep-alive');
    res.header('Access-Control-Allow-Origin', '*');

    const send = (data: object) => {
      res.raw.write(
        `data: ${JSON.stringify(data)}\n\n`,
      );
    };

    try {
      await this.agentRunner.run({
        agentSlug,
        input: message,

        onToken(token: string) {
          send({
            type: 'token',
            content: token,
          });
        },

        onDone(data: any) {
          send({
            type: 'done',
            data,
          });
        },
      });
    } catch (error) {
      send({
        type: 'error',
        content:
          error instanceof Error
            ? error.message
            : 'Unexpected error',
      });
    } finally {
      send({
        type: 'end',
      });
    }
  }
}