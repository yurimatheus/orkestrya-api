import { Injectable } from '@nestjs/common';

export interface StreamToken {
  type: 'token' | 'tool_call' | 'error';
  content?: string;
  toolName?: string;
  toolInput?: any;
}

export interface AggregatedResponse {
  tokens: string[];
  content: string;
  toolCalls: Array<{
    name: string;
    input: any;
  }>;
  errors: string[];
  finishReason?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class ResponseAggregator {
  private response: AggregatedResponse = {
    tokens: [],
    content: '',
    toolCalls: [],
    errors: [],
  };

  reset(): void {
    this.response = {
      tokens: [],
      content: '',
      toolCalls: [],
      errors: [],
    };
  }

  addToken(token: string): void {
    this.response.tokens.push(token);
    this.response.content += token;
  }

  addTokenBatch(tokens: string[]): void {
    tokens.forEach((token) => this.addToken(token));
  }

  addError(error: string): void {
    this.response.errors.push(error);
  }

  addToolCall(toolName: string, toolInput: any): void {
    this.response.toolCalls.push({
      name: toolName,
      input: toolInput,
    });
  }

  setFinishReason(reason: string): void {
    this.response.finishReason = reason;
  }

  setMetadata(key: string, value: any): void {
    if (!this.response.metadata) {
      this.response.metadata = {};
    }
    this.response.metadata[key] = value;
  }

  getResponse(): AggregatedResponse {
    return { ...this.response };
  }

  getContent(): string {
    return this.response.content;
  }

  getTokens(): string[] {
    return [...this.response.tokens];
  }

  getTokenCount(): number {
    return this.response.tokens.length;
  }

  getCharacterCount(): number {
    return this.response.content.length;
  }

  hasErrors(): boolean {
    return this.response.errors.length > 0;
  }

  hasToolCalls(): boolean {
    return this.response.toolCalls.length > 0;
  }
}
