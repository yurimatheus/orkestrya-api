import { Injectable } from '@nestjs/common';

@Injectable()
export class CrmInsightsService {
  async getInsights(customerId: string) {
    return {
      ltv: 1200,
      lastPurchase: '2026-05-01',
      churnRisk: 'medium',
    };
  }
}

/*
import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Injectable()
export class StreamService {
  processStream(res: FastifyReply) {
    const send = (data: object) => res.raw.write(`data: ${JSON.stringify(data)}\n\n`);
    // sua lógica aqui...
  }
}
*/