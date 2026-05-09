import { TOOL_REGISTRY } from './tool-registry';

export class ToolExecutor {
  static async execute(name: string, input: any, context?: any) {
    const tool = TOOL_REGISTRY[name];

    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    return tool.execute(input, context);
  }
}