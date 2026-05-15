Você é um engenheiro DevOps + NestJS.

Tenho uma API NestJS chamada `orkestrya-api`.

Ambiente de desenvolvimento:
- VS Code local
- Manjaro Linux
- Docker/Compose local
- NestJS 11
- Fastify
- Prisma 7.8
- PostgreSQL
- Node 22

Objetivo:
Criar inicialmente as imagens/arquivos Docker para rodar localmente e depois facilitar deploy no Coolify.

Arquivos esperados:

- Dockerfile
- docker-compose.yml
- .dockerignore
- .env.example
- opcional: docker-compose.coolify.yml ou instrução clara para Coolify

## Desenvolvimento local

Criar serviços:

- api
- postgres

A API deve:

- usar `node:22-alpine`
- rodar com `npm run start:dev`
- expor porta `3000`
- suportar hot reload
- montar código local como volume
- preservar `node_modules` dentro do container
- depender do PostgreSQL saudável

PostgreSQL local:

- imagem: `postgres:18`
- POSTGRES_USER=orkestrya
- POSTGRES_PASSWORD=orkestrya
- POSTGRES_DB=orkestrya_db
- porta local: `5432`
- volume persistente
- healthcheck com `pg_isready`

DATABASE_URL local para Docker Compose:

DATABASE_URL="postgresql://orkestrya:orkestrya@postgres:5432/orkestrya_db?schema=public"

Importante:
Dentro do Docker Compose local, o host do banco deve ser `postgres`.

## Coolify

No Coolify, o PostgreSQL será outro serviço/container criado separadamente.

Por isso, preparar `.env.example` com duas opções:

### Local Docker Compose

DATABASE_URL="postgresql://orkestrya:orkestrya@postgres:5432/orkestrya_db?schema=public"

### Coolify

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"

Importante:
No Coolify, considerar que a URL real do PostgreSQL será definida nas variáveis de ambiente do próprio Coolify.

Não hardcodar credenciais de produção.

## Prisma

O projeto usa Prisma 7.8.

Manter compatibilidade com:

- npx prisma generate
- npx prisma migrate dev
- npx prisma db seed

Seed existente:

"prisma": {
  "seed": "ts-node prisma/seed.ts"
}

Não remover nem alterar sem necessidade.

## Scripts existentes

Usar:

- npm run start:dev
- npm run build
- npm run start:prod

Não modificar package.json, exceto se for absolutamente necessário.

## Resultado esperado local

Rodar:

docker compose up --build

A API deve abrir em:

http://localhost:3000

O PostgreSQL local deve estar acessível em:

localhost:5432

## Instruções finais

Explique:

1. Quais arquivos foram criados
2. Como rodar no Manjaro Linux
3. Como parar os containers
4. Como ver logs
5. Como rodar comandos Prisma dentro do container:
   docker compose exec api npx prisma generate
   docker compose exec api npx prisma migrate dev
   docker compose exec api npx prisma db seed
6. Como adaptar para Coolify usando variáveis de ambiente

Não adicionar:

- Nginx
- Redis
- Kubernetes
- Traefik
- Docker Swarm
- arquitetura extra

Quero apenas as imagens/arquivos Docker necessários para NestJS + PostgreSQL.