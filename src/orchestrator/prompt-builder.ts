import { Injectable } from '@nestjs/common';
import { AgentDefinition } from '../agents/agent.definition';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class PromptBuilder {
  buildMessages(
    agent: AgentDefinition,
    userInput: string,
  ): Message[] {
    const messages: Message[] = [];

    // System prompt base
    const systemContent = this.buildSystemPrompt(agent);
    messages.push({
      role: 'system',
      content: systemContent,
    });

    // User input
    messages.push({
      role: 'user',
      content: userInput,
    });

    return messages;
  }

  private buildSystemPrompt(agent: AgentDefinition): string {
    const parts: string[] = [];

    // Identity
    if (agent.identity) {
      parts.push(`Você é ${agent.identity.name}.`);
      if (agent.identity.role) {
        parts.push(`Seu papel é: ${agent.identity.role}.`);
      }
      if (agent.identity.description) {
        parts.push(`Descrição: ${agent.identity.description}.`);
      }
    }

    // Base system prompt
    if (agent.prompts?.system) {
      parts.push(agent.prompts.system);
    }

    // Objectives
    if (agent.objectives && agent.objectives.length > 0) {
      parts.push('\nObjetivos:');
      agent.objectives.forEach((obj) => {
        parts.push(`- ${obj}`);
      });
    }

    // Rules
    if (agent.rules && agent.rules.length > 0) {
      parts.push('\nRegras que você deve seguir:');
      agent.rules.forEach((rule) => {
        parts.push(`- ${rule}`);
      });
    }

    // Behavior
    if (agent.behavior) {
      if (agent.behavior.tone) {
        parts.push(`\nTom: ${agent.behavior.tone}.`);
      }
      if (agent.behavior.style) {
        parts.push(`Estilo: ${agent.behavior.style}.`);
      }
    }

    // Additional instructions
    if (agent.prompts?.instructions && agent.prompts.instructions.length > 0) {
      parts.push('\nInstruções específicas:');
      agent.prompts.instructions.forEach((instr) => {
        parts.push(`- ${instr}`);
      });
    }

    // Constraints
    if (agent.prompts?.constraints && agent.prompts.constraints.length > 0) {
      parts.push('\nRestrições:');
      agent.prompts.constraints.forEach((constraint) => {
        parts.push(`- ${constraint}`);
      });
    }

    return parts.join('\n').trim();
  }
}
