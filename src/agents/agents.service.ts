import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentDefinition } from './agent.definition';
import {
  RecuperadorCarrinhoAgent,
  ConsultorVendasAgent,
  NegociadorPrecoAgent,
  ProspectorLeadsAgent,
  UpsellCrosssellAgent,
  SuporteN1Agent,
  SuporteTecnicoAgent,
  GestorReclamacoesAgent,
  OmbudsmanAgent,
  CopywriterAgent,
  RedatorSEOAgent,
  GestorRedesSociaisAgent,
  EmailMarketingAgent,
  AnalistaDadosAgent,
  AnalistaFinanceiroAgent,
  PesquisadorMercadoAgent,
  RecrutadorAgent,
  CoachCarreiraAgent,
  GestorOnboardingAgent,
  AssistenteJuridicoAgent,
  ComplianceAgent,
  ProductManagerAgent,
  ArquitetoSistemasAgent,
  CodeReviewerAgent,
  OtimizadorProcessosAgent,
  GestorProjetosAgent,
  TutorElearningAgent,
  CriadorCurriculoAgent,
  ConsultorEstrategicoAgent,
  MentorStartupAgent,
} from './definitions/index';

const ALL_AGENTS: AgentDefinition[] = [
  RecuperadorCarrinhoAgent,
  ConsultorVendasAgent,
  NegociadorPrecoAgent,
  ProspectorLeadsAgent,
  UpsellCrosssellAgent,
  SuporteN1Agent,
  SuporteTecnicoAgent,
  GestorReclamacoesAgent,
  OmbudsmanAgent,
  CopywriterAgent,
  RedatorSEOAgent,
  GestorRedesSociaisAgent,
  EmailMarketingAgent,
  AnalistaDadosAgent,
  AnalistaFinanceiroAgent,
  PesquisadorMercadoAgent,
  RecrutadorAgent,
  CoachCarreiraAgent,
  GestorOnboardingAgent,
  AssistenteJuridicoAgent,
  ComplianceAgent,
  ProductManagerAgent,
  ArquitetoSistemasAgent,
  CodeReviewerAgent,
  OtimizadorProcessosAgent,
  GestorProjetosAgent,
  TutorElearningAgent,
  CriadorCurriculoAgent,
  ConsultorEstrategicoAgent,
  MentorStartupAgent,
];

@Injectable()
export class AgentsService {
  private agents = new Map<string, AgentDefinition>(
    ALL_AGENTS.map((a) => [a.slug, a]),
  );

  findAll(): AgentDefinition[] {
    return ALL_AGENTS;
  }

  findOne(slug: string): AgentDefinition {
    const agent = this.agents.get(slug);
    if (!agent) throw new NotFoundException(`Agent "${slug}" não encontrado`);
    return agent;
  }

  findByCategory(category: string): AgentDefinition[] {
    return ALL_AGENTS.filter((a) => a.slug.includes(category));
  }
}
