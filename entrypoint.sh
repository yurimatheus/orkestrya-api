#!/bin/sh

# Aguardar o banco de dados estar pronto
echo "Aguardando PostgreSQL..."
while ! npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL pronto."

# Gerar cliente Prisma
echo "Gerando cliente Prisma..."
npx prisma generate

# Se for produção, executar migrações e seed
if [ "$NODE_ENV" = "production" ]; then
  echo "Executando migrações..."
  npx prisma migrate deploy

  echo "Executando seed..."
  npx prisma db seed
fi

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec "$@"