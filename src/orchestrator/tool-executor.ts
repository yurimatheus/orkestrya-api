import { Injectable, BadRequestException } from '@nestjs/common';
import { ToolRegistry } from './tool-registry';

@Injectable()
export class ToolExecutor {
  constructor(private readonly toolRegistry: ToolRegistry) {}

  async execute(
    toolName: string,
    input: any,
    context?: any,
  ): Promise<any> {
    const tool = this.toolRegistry.get(toolName);

    if (!tool) {
      throw new BadRequestException(
        `Tool "${toolName}" not found in registry`,
      );
    }

    try {
      return await tool.execute(input, context);
    } catch (error) {
      throw new BadRequestException(
        `Tool "${toolName}" execution failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}