import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { CrmInsightsService } from './crm-insights.service';
import { Tool } from '../../orchestrator/tool-registry';

@Injectable()
export class CrmInsightsTool implements Tool {
  name = 'crm_insights';
  description = 'Retorna insights comerciais do CRM';

  inputSchema = z.object({
    customerId: z.string(),
  });

  constructor(
    private readonly crmInsightsService: CrmInsightsService,
  ) {}

  async execute(input: any): Promise<any> {
    const validated = this.inputSchema.parse(input);
    return this.crmInsightsService.getInsights(validated.customerId);
  }
}