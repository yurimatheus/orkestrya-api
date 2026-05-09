export interface AgentDefinition {
  slug: string;

  identity: {
    name: string;
    role?: string;
    description?: string;
  };

  model: {
    provider: string;
    name: string;
    temperature?: number;
    maxTokens?: number;
  };

  behavior?: {
    tone?: string;
    style?: string;
    salesStyle?: 'consultative' | 'aggressive' | 'informative' | 'advisory' | 'insight-driven' | 'neutral';
    aggressiveness?: 'low' | 'medium' | 'high';
  };

  objectives?: string[];

  rules?: string[];

  tools?: string[];

  memory?: {
    persistent?: boolean;
    summarizeAfter?: number;
  };

  prompts?: {
    system?: string;
    instructions?: string[];
    constraints?: string[];
  };

  metadata?: {
    version?: string;
    tags?: string[];
  };
}