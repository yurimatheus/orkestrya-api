# 🤖 Orkestrya Agent API

Uma plataforma modular escalável baseada em arquitetura de **runtime cognitivo** com agentes de IA, orchestration e streaming em tempo real.

## 🎯 Visão Geral

O Orkestrya é um sistema que transforma um simples chat em uma arquitetura enterprise-ready de **agentes autônomos** com:

- ✅ **Runtime cognitivo** robusto com fluxo de execução consistente
- ✅ **Streaming SSE** em tempo real com agregação de resposta
- ✅ **System de tools** desacoplado e extensível
- ✅ **Injeção de dependências** corrigida e modular
- ✅ **Múltiplos agentes** com definições independentes
- ✅ **Suporte para múltiplos providers LLM** (OpenRouter)
- ✅ **Prompt builder** que consolida system, rules e constraints
- ✅ **Tratamento de erro** robusto com fallbacks

---

## 🏗️ Arquitetura

### Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend / Cliente                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌─────────────────────────────┐
            │    ChatController           │
            │  (POST /chat/stream)        │
            └────────┬────────────────────┘
                     │
                     ▼
            ┌─────────────────────────────┐
            │     ChatService             │
            │  (SSE Transport)            │
            │  - flushHeaders()           │
            │  - Error handling           │
            │  - Graceful shutdown        │
            └────────┬────────────────────┘
                     │
                     ▼
        ┌────────────────────────────────────┐
        │      AgentRunner (Runtime)         │
        │  - Orquestra fluxo cognitivo      │
        │  - Agregação de resposta          │
        │  - Tool resolution                │
        └────────┬─────────────┬─────────────┘
                 │             │
        ┌────────▼──┐   ┌──────▼────────┐
        │PromptBuild│   │ResponseAggr. │
        │ (Prompt)  │   │ (Tokens)      │
        └────────┬──┘   └───────────────┘
                 │
        ┌────────▼──────────────┐
        │   LlmService          │
        │ (Provider Adapter)    │
        │  - stream parsing     │
        │  - error handling     │
        │  - chunk buffering    │
        └────────┬──────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │   OpenRouter API     │
        │  (LLM Provider)      │
        └──────────────────────┘
```

### Estrutura de Módulos NestJS

```
AppModule
├── ChatModule
│   ├── ChatController
│   └── ChatService
│       └── (deps) AgentRunner
│
├── AgentsModule
│   ├── AgentsService
│   ├── AgentsController
│   └── definitions/
│       └── [30+ Agent Definitions]
│
└── OrchestratorModule (Core)
    ├── AgentRunner (★ Orquestra fluxo cognitivo)
    ├── PromptBuilder (★ Constrói prompts robusto)
    ├── ResponseAggregator (★ Agrega tokens)
    ├── ToolExecutor (★ Executa tools)
    ├── ToolRegistry (★ Registro de ferramentas)
    ├── LlmModule
    │   └── LlmService (Adapter OpenRouter)
    │
    └── ToolsModule
        ├── CrmInsightsTool
        ├── CrmInsightsService
        └── ToolRegistryBootstrap
```

---

## 📂 Estrutura de Diretórios

```
src/
├── agents/                      # ★ Definições e orquestração de agentes
│   ├── agents.module.ts
│   ├── agents.service.ts        # Lookup e busca de agentes
│   ├── agents.controller.ts     # GET /agents, /agents/:slug
│   ├── agent.definition.ts      # Interface de definição de agente
│   └── definitions/
│       ├── index.ts             # 30+ agentes pré-definidos
│       └── [individual agents]
│
├── chat/                        # ★ Transporte HTTP/SSE
│   ├── chat.module.ts
│   ├── chat.controller.ts       # POST /chat/stream
│   └── chat.service.ts          # Streaming SSE com flushHeaders
│
├── orchestrator/                # ★★★ Core Runtime Cognitivo
│   ├── orchestrator.module.ts
│   ├── agent-runner.ts          # ★ Orquestra fluxo: prompt → LLM → resposta
│   ├── prompt-builder.ts        # ★ Consolida system, rules, constraints
│   ├── response-aggregator.ts   # ★ Agrega tokens e metadados
│   ├── tool-executor.ts         # Executa tools via registry
│   ├── tool-registry.ts         # ★ Map de tools disponíveis
│   └── tool-registry-bootstrap.ts
│
├── llm/                         # ★ Provider Adapter (OpenRouter)
│   ├── llm.module.ts
│   └── llm.service.ts           # Parsing SSE robusto, chunk buffering
│
├── tools/                       # ★ Sistema de capabilities
│   ├── tools.module.ts
│   └── crm_insights/
│       ├── crm-insights.tool.ts     # Tool interface
│       ├── crm-insights.service.ts
│       ├── crm-insights.types.ts
│       └── index.ts
│
├── app.module.ts                # Root module
├── app.controller.ts            # GET / (health check)
├── app.service.ts
└── main.ts                      # Entry point, bootstrap
```

---

## 🚀 Fluxo de Execução (Cognitive Runtime)

### 1️⃣ Cliente envia mensagem

```
POST /chat/stream
{
  "agentSlug": "consultor-vendas",
  "message": "Como faço para aumentar minhas vendas?"
}
```

### 2️⃣ ChatService configura SSE

- Define headers: `Content-Type: text/event-stream`
- Chama `res.raw.flushHeaders()` para iniciar streaming imediato
- Passa callbacks para `AgentRunner`

### 3️⃣ AgentRunner Orquestra o Fluxo

```typescript
// Carrega agente
const agent = agentsService.findOne('consultor-vendas');

// Constrói prompt robusto
const messages = promptBuilder.buildMessages(agent, userInput);
// Resultado:
// - System: identidade + tom + regras + constraints
// - User: input do usuário

// Chama LLM com streaming
await llmService.stream({
  model: agent.model.name,
  messages,
  onToken: (token) => {
    responseAggregator.addToken(token);    // Agrega
    chatService.send({ type: 'token', content: token }); // Streamea
  }
});

// Finaliza com resposta agregada
onDone({
  agent: { slug, name },
  response: { content, tokenCount, characterCount },
  metadata: { temperature, maxTokens, timestamp }
});
```

### 4️⃣ LlmService Faz Parsing Robusto

- Conecta a OpenRouter
- Valida `response.ok`
- Faz buffer de chunks incompletos
- Parse line-by-line SSE
- Extrai tokens com segurança
- Trata erros sem quebrar stream

### 5️⃣ Cliente Recebe SSE Events

```
data: { "type": "token", "content": "Olá, " }
data: { "type": "token", "content": "eu" }
data: { "type": "token", "content": " " }
data: { "type": "token", "content": "posso" }
...
data: { "type": "done", "data": { "agent": {...}, "response": {...} } }
data: { "type": "end" }
```

---

## 📋 Componentes Principais

### 🤖 AgentRunner

**Responsabilidade:** Orquestra o fluxo cognitivo completo.

```typescript
// Fluxo interno
1. Carrega definição do agente
2. Constrói prompt via PromptBuilder
3. Chama LlmService com callbacks
4. Agrega resposta via ResponseAggregator
5. Retorna resultado final
```

**Características:**
- Tratamento de erro com fallback
- Metadados estruturados
- Pronto para multi-agent concorrente

---

### 📝 PromptBuilder

**Responsabilidade:** Consolida um prompt robusto a partir da definição do agente.

**Inclui automaticamente:**
- Identidade do agente
- Role e descrição
- System prompt base
- Objetivos do agente
- Regras de comportamento
- Tone e estilo
- Instruções específicas
- Constraints

---

### 📊 ResponseAggregator

**Responsabilidade:** Agrega tokens, metadados e coordena resposta final.

**API:**
```typescript
addToken(token)           // Agrega um token
addTokenBatch(tokens)     // Agrega múltiplos
addError(error)           // Registra erro
addToolCall(name, input)  // Registra call de tool
setFinishReason(reason)   // Motivo de finalização
setMetadata(key, value)   // Metadados customizados

getResponse()             // Resposta completa
getContent()              // Conteúdo final
getTokenCount()           // Contagem de tokens
getCharacterCount()       // Contagem de chars
hasErrors()               // Validação
hasToolCalls()            // Validação
```

---

### 🛠️ ToolExecutor & ToolRegistry

**Responsabilidade:** Sistema desacoplado e extensível de ferramentas.

**ToolRegistry:** Mapa dinâmico de tools disponíveis

**ToolExecutor:** Executa com validação

---

## 🤖 Agentes Disponíveis

O sistema vem com **30+ agentes pré-definidos** em múltiplas categorias (Vendas, Suporte, Marketing, Financeiro, RH, Jurídico, Tech, Estratégia).

---

## 🔧 Como Usar

### Iniciar a aplicação

```bash
# Desenvolvimento com watch
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Endpoints principais

```bash
# Ver todos os agentes
GET /agents

# Buscar um agente específico
GET /agents/consultor-vendas

# Iniciar chat com streaming SSE
POST /chat/stream
Content-Type: application/json

{
  "agentSlug": "consultor-vendas",
  "message": "Qual é a melhor forma de aumentar vendas?"
}
```

### Exemplo com JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3000/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentSlug: 'consultor-vendas',
    message: 'Como aumentar vendas?'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      
      if (event.type === 'token') {
        console.log(event.content);
      } else if (event.type === 'done') {
        console.log('Agente:', event.data.agent.name);
      } else if (event.type === 'end') {
        console.log('Finalizado');
      }
    }
  }
}
```

---

## 🛠️ Como Adicionar Novos Agentes

Criar definição em `src/agents/definitions/index.ts` e registrar em `ALL_AGENTS`.

---

## 🛠️ Como Adicionar Novas Tools

1. Criar a ferramenta em `src/tools/minha-tool/`
2. Implementar interface `Tool`
3. Registrar em `src/orchestrator/tool-registry-bootstrap.ts`
4. Usar em agentes via `tools` array

---

## 📚 Testes

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```

---

## 🚨 Tratamento de Erros

- Cada serviço valida e trata seus erros
- Recuperação graceful em SSE
- Eventos de erro sem quebrar stream

---

## 📄 Licença

UNLICENSED

---

## 🏛️ Filosofia da Arquitetura

A Orkestrya não é apenas um chatbot - é uma **camada operacional cognitiva** onde:

- Agentes pensam com especialização
- Tools executam capabilities reutilizáveis
- Runtime coordena fluxo de execução
- Módulos empresariais alimentam o sistema
- Memória contextualiza interações
- Workflows coordenam processos multi-step

**Evolução Natural:**
```
Local Tool → Internal API → External API → MCP Server 
→ Workflow Tool → Multi-Agent Runtime → Cognitive OS
```

---

## 🔮 Tools Roadmap (Em Breve)

Ferramentas planejadas organizadas por domínio:

### 📊 SALES & E-COMMERCE

- `customer_history` - Histórico completo do cliente
- `product_catalog` - Catálogo de produtos
- `crm_insights` - ⭐ Insights comerciais (implementada)
- `cart_data` - Dados de carrinho
- `pricing_rules` - Regras de preço dinâmicas
- `lead_database` - Base de leads qualificados
- `company_enrichment` - Enriquecimento de dados de empresa

### 💬 SUPPORT & CUSTOMER SERVICE

- `knowledge_base` - Base de conhecimento
- `order_tracking` - Rastreamento de pedidos
- `faq_system` - Sistema de FAQ
- `incident_logs` - Logs de incidentes
- `system_diagnostics` - Diagnósticos de sistema
- `ticket_system` - Sistema de tickets

### ⚖️ LEGAL & COMPLIANCE

- `compliance_records` - Registros de compliance
- `contract_analyzer` - Analisador de contratos
- `compliance_database` - Base de compliance
- `legal_templates` - Templates legais
- `risk_assessment` - Avaliação de riscos
- `policy_management` - Gestão de políticas

### 📢 MARKETING & CONTENT

- `brand_guidelines` - Guia de marca
- `campaign_history` - Histórico de campanhas
- `customer_avatar` - Avatar do cliente
- `keyword_research` - Pesquisa de keywords
- `seo_analyzer` - Analisador SEO
- `content_guidelines` - Guia de conteúdo
- `trend_analysis` - Análise de trends
- `content_calendar` - Calendário editorial
- `email_analytics` - Analytics de email
- `automation_flows` - Fluxos de automação

### 💰 DATA & FINANCE

- `bi_dashboard` - Dashboard BI
- `data_warehouse` - Data warehouse
- `reporting_system` - Sistema de relatórios
- `financial_reports` - Relatórios financeiros
- `cashflow_dashboard` - Dashboard de fluxo de caixa
- `forecasting_system` - Sistema de previsão

### 🔍 STRATEGY & RESEARCH

- `market_intelligence` - Inteligência de mercado
- `competitor_analysis` - Análise de competidores
- `trend_monitoring` - Monitoramento de trends
- `scenario_planning` - Planejamento de cenários
- `business_frameworks` - Frameworks de negócio

### 👥 HR & TALENT

- `candidate_database` - Base de candidatos
- `resume_parser` - Parser de currículo
- `interview_frameworks` - Frameworks de entrevista
- `career_assessment` - Avaliação de carreira
- `goal_planning` - Planejamento de objetivos
- `skills_mapping` - Mapeamento de skills
- `employee_handbook` - Manual do colaborador
- `training_platform` - Plataforma de treinamento

### 🎓 EDUCATION & LEARNING

- `task_checklists` - Checklists de tarefas
- `learning_tracker` - Rastreador de aprendizado
- `adaptive_assessment` - Avaliação adaptativa
- `learning_frameworks` - Frameworks de aprendizado
- `training_templates` - Templates de treinamento

### 🚀 PRODUCT & PROJECT MANAGEMENT

- `roadmap_planner` - Planejador de roadmap
- `user_feedback` - Feedback de usuários
- `product_analytics` - Analytics de produto
- `project_tracker` - Rastreador de projetos
- `risk_management` - Gestão de riscos
- `task_planning` - Planejamento de tarefas

### 🏗️ ENGINEERING & INFRASTRUCTURE

- `system_diagrams` - Diagramas de sistema
- `architecture_patterns` - Padrões de arquitetura
- `infrastructure_monitoring` - Monitoramento de infraestrutura
- `static_analysis` - Análise estática
- `security_scanner` - Scanner de segurança
- `performance_profiler` - Perfilador de performance

### ⚙️ OPERATIONS & PROCESSES

- `process_mapping` - Mapeamento de processos
- `workflow_analytics` - Analytics de workflow
- `performance_metrics` - Métricas de performance

### 🚀 STARTUP & GROWTH

- `startup_playbooks` - Playbooks de startup
- `growth_metrics` - Métricas de growth
- `fundraising_frameworks` - Frameworks de fundraising

---

## 📝 Como Registrar uma Nova Tool

Quando uma ferramenta estiver pronta, siga os passos:

1. **Criar arquivo da ferramenta:**

```bash
mkdir -p src/tools/minha-nova-tool
touch src/tools/minha-nova-tool/minha-nova-tool.service.ts
touch src/tools/minha-nova-tool/minha-nova-tool.tool.ts
```

2. **Implementar a ferramenta:**

```typescript
// minha-nova-tool.tool.ts
@Injectable()
export class MinhaNovaToolTool implements Tool {
  name = 'minha_nova_tool';
  description = 'Descrição da ferramenta';
  
  inputSchema = z.object({
    param1: z.string(),
    param2: z.number(),
  });
  
  constructor(private readonly service: MinhaNovaToolService) {}
  
  async execute(input: any): Promise<any> {
    const validated = this.inputSchema.parse(input);
    return this.service.execute(validated);
  }
}

```
3. **Registrar em ToolsModule:**

```typescript
@Module({
  providers: [
    CrmInsightsService,
    CrmInsightsTool,
    MinhaNovaToolService,      // ← Adicionar
    MinhaNovaToolTool,          // ← Adicionar
  ],
  exports: [
    CrmInsightsService,
    CrmInsightsTool,
    MinhaNovaToolService,       // ← Adicionar
    MinhaNovaToolTool,          // ← Adicionar
  ],
})
export class ToolsModule {}
```

1. **Registrar em ToolRegistryBootstrap:**

```typescript
@Injectable()
export class ToolRegistryBootstrap implements OnModuleInit {
  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly crmInsightsTool: CrmInsightsTool,
    private readonly minhaNovaToolTool: MinhaNovaToolTool,  // ← Adicionar
  ) {}

  onModuleInit() {
    this.toolRegistry.register(this.crmInsightsTool);
    this.toolRegistry.register(this.minhaNovaToolTool);     // ← Registrar
  }
}
```

2. **Usar em agentes:**
```typescript
tools: [
  'crm_insights',
  'minha_nova_tool',  // ← Agora disponível
],
```

---

**Made with ❤️ by Orkestrya Team**
