import { Injectable, BadRequestException } from '@nestjs/common';

export interface LlmChatPayload {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

export interface LlmStreamPayload extends LlmChatPayload {
  onToken: (token: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

@Injectable()
export class LlmService {
  private readonly apiKey = process.env.OPENROUTER_API_KEY;
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor() {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }
  }

  async chat(payload: LlmChatPayload) {
    const response = await this.fetchOpenRouter({
      ...payload,
      stream: false,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new BadRequestException(
        `OpenRouter API error: ${response.status} - ${error}`,
      );
    }

    return response.json();
  }

  async stream(payload: LlmStreamPayload) {
    try {
      payload.onStart?.();

      const response = await this.fetchOpenRouter({
        model: payload.model,
        messages: payload.messages,
        temperature: payload.temperature,
        max_tokens: payload.max_tokens,
        stream: true,
      });

      if (!response.ok) {
        const error = await response.text();
        const errorMsg = `OpenRouter API error: ${response.status} - ${error}`;
        payload.onError?.(errorMsg);
        throw new BadRequestException(errorMsg);
      }

      await this.processStreamResponse(response, payload);
      payload.onEnd?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      payload.onError?.(errorMsg);
      throw error;
    }
  }

  private async fetchOpenRouter(payload: any) {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  private async processStreamResponse(
    response: Response,
    payload: LlmStreamPayload,
  ) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body from OpenRouter');
    }

    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          this.processLine(line, payload);
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        this.processLine(buffer, payload);
      }
    } finally {
      reader.releaseLock();
    }
  }

  private processLine(line: string, payload: LlmStreamPayload) {
    if (!line.startsWith('data: ')) {
      return;
    }

    const data = line.slice(6).trim();

    if (data === '[DONE]') {
      return;
    }

    if (!data) {
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const token = parsed.choices?.[0]?.delta?.content;

      if (token) {
        payload.onToken(token);
      }
    } catch (error) {
      // Skip malformed JSON, don't error out entire stream
      console.warn('Failed to parse SSE line:', data, error);
    }
  }
}
