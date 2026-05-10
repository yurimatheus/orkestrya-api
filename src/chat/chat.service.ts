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
    try {
      // Setup SSE headers
      res.header('Content-Type', 'text/event-stream');
      res.header('Cache-Control', 'no-cache');
      res.header('Connection', 'keep-alive');
      res.header('Access-Control-Allow-Origin', '*');

      // Flush headers immediately
      res.raw.flushHeaders();

      const send = (data: object) => {
        try {
          res.raw.write(
            `data: ${JSON.stringify(data)}\n\n`,
          );
        } catch (err) {
          console.error('Error writing to SSE stream:', err);
        }
      };

      // Run the agent with streaming callbacks
      await this.agentRunner.run({
        agentSlug,
        input: message,

        onToken(token: string) {
          send({
            type: 'token',
            content: token,
          });
        },

        onError(error: string) {
          send({
            type: 'error',
            content: error,
          });
        },

        onDone(data: any) {
          send({
            type: 'done',
            data,
          });

          // End the connection
          send({ type: 'end' });
          res.raw.end();
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unexpected error';

      try {
        res.raw.write(
          `data: ${JSON.stringify({
            type: 'error',
            content: errorMessage,
          })}\n\n`,
        );
      } catch (err) {
        // Connection may already be closed
        console.error('Error sending error message:', err);
      }

      try {
        res.raw.end();
      } catch (err) {
        console.error('Error closing response:', err);
      }
    }
  }
}