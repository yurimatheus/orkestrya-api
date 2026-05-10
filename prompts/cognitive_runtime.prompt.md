Preciso que você atue como um arquiteto de software senior especializado em:

* NestJS
* runtimes cognitivos
* sistemas multiagentes
* streaming SSE
* arquiteturas enterprise
* IA escalável

Objetivo:
Refatorar e corrigir a arquitetura atual do projeto, aplicar correções estruturais reais no código e atualizar completamente o README.md conforme a nova arquitetura.

Contexto do projeto:
O sistema é uma plataforma modular baseada em agentes de IA.

Arquitetura atual:

* chat → entrada HTTP + SSE
* orchestrator → runtime cognitivo/agentes
* llm → providers de IA
* tools → capabilities/tools
* agents → definições dos agentes

Problemas críticos atuais:

1. NestJS DI quebrado:
   Nest can't resolve dependencies of the AgentRunner (?, LlmService)

Causa provável:
OrchestratorModule não importa AgentsModule.

2. SSE incompleto:

* ausência de flushHeaders()
* ausência de encerramento correto da conexão
* risco de conexões presas

3. LlmService.stream() frágil:

* parser SSE quebrável
* não trata chunks parciais
* não verifica response.ok
* mistura adapter + parsing + orchestration

4. Runtime cognitivo incompleto:

* AgentRunner apenas streama tokens
* não agrega resposta final
* não existe pipeline de memória/tools/contexto
* não existe runtime state consistente

5. Sistema de tools inconsistente:

* TOOL_REGISTRY manual
* ToolExecutor fora da DI
* uso de new Service() fora do Nest
* agentes declaram tools inexistentes

6. Boundary modular inconsistente:

* módulos não respeitam imports/exports corretamente
* ChatService conhece detalhes internos do runtime
* acoplamento excessivo

O que preciso que seja feito:

1. Corrigir toda a estrutura modular do NestJS
2. Corrigir providers/imports/exports
3. Resolver dependências quebradas
4. Refatorar ToolExecutor para DI adequada
5. Criar um ToolsModule real
6. Criar ToolRegistry desacoplado e extensível
7. Melhorar AgentRunner
8. Criar runtime cognitivo mais robusto
9. Implementar fluxo consistente de:

   * prompt builder
   * memory/context
   * tool resolution
   * stream aggregation
   * final response
10. Melhorar arquitetura SSE
11. Melhorar abstração de providers LLM
12. Separar:

* orchestration
* provider adapter
* transport
* runtime

13. Remover anti-patterns NestJS
14. Corrigir possíveis memory leaks
15. Melhorar escalabilidade e extensibilidade

Também quero:

* sugestões de estrutura de pastas enterprise-ready
* melhorias de naming
* separação por domínio
* sugestões de testes
* melhorias de observabilidade/logging
* tratamento de erro robusto
* fallback de provider
* preparação para múltiplos agentes concorrentes

Atualize também o README.md:
O README deve:

* explicar claramente a arquitetura
* explicar fluxo cognitivo
* explicar módulos
* explicar runtime
* explicar streaming SSE
* explicar tools
* explicar providers
* mostrar estrutura de diretórios
* explicar como adicionar novos agentes
* explicar como adicionar novas tools
* explicar como adicionar novos providers LLM
* incluir fluxo de execução
* incluir exemplos
* incluir visão arquitetural moderna e escalável

Importante:
Quero correções reais e sugestões aplicáveis no código, não apenas análise teórica.
