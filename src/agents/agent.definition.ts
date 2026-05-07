export interface AgentDefinition {
  slug: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}
