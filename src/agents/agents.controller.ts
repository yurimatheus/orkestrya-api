import { Controller, Get, Param } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.agentsService.findOne(slug);
  }
}
