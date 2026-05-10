import { Injectable } from '@nestjs/common';

export interface Tool {
  name: string;
  description: string;
  inputSchema?: any;
  execute(input: any, context?: any): Promise<any>;
}

@Injectable()
export class ToolRegistry {
  private registry = new Map<string, Tool>();

  register(tool: Tool): void {
    this.registry.set(tool.name, tool);
  }

  get(name: string): Tool | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  list(): Tool[] {
    return Array.from(this.registry.values());
  }
}