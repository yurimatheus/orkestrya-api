import { Module } from '@nestjs/common';

import { CrmInsightsService } from './crm_insights/crm-insights.service';
import { CrmInsightsTool } from './crm_insights/crm-insights.tool';

@Module({
  providers: [
    CrmInsightsService,
    CrmInsightsTool,
  ],
  exports: [
    CrmInsightsService,
    CrmInsightsTool,
  ],
})
export class ToolsModule {}

