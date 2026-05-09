import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  async chat(payload: any) {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: payload.model,
          messages: payload.messages,
        }),
      },
    );

    return response.json();
  }

  async stream(payload: any) {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          model: payload.model,
          messages: payload.messages,
          temperature: payload.temperature,
          max_tokens: payload.maxTokens,
          stream: true,
        }),
      },
    );

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const token =
              parsed.choices?.[0]?.delta?.content || '';
            if (token && payload.onToken) {
              payload.onToken(token);
            }
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }
  }
}