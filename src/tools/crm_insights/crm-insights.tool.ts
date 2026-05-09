import { z } from 'zod';
import { CrmInsightsService } from './crm-insights.service';

const crmInsightsService = new CrmInsightsService();

export const CrmInsightsTool = {
  name: 'crm_insights',
  description: 'Retorna insights comerciais do CRM',

  inputSchema: z.object({
    customerId: z.string(),
  }),

  async execute(input, context) {
    return crmInsightsService.getInsights(input.customerId);
  },
};