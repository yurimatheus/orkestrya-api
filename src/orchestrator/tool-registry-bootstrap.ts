import { Injectable, OnModuleInit } from '@nestjs/common';
import { ToolRegistry } from './tool-registry';
import { CrmInsightsTool } from '../tools/crm_insights/crm-insights.tool';

@Injectable()
export class ToolRegistryBootstrap implements OnModuleInit {
  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly crmInsightsTool: CrmInsightsTool,
  ) {}

  onModuleInit() {
    // Register all tools here
    this.toolRegistry.register(this.crmInsightsTool);
  }
}
