# 📄 DocumentSS — Gerenciamento de Documentos

API RESTful + Interface Web para gerenciamento de documentos, construída como teste prático fullstack.

## Tecnologias

| Camada       | Stack                                       |
|--------------|----------------------------------------------|
| **Backend**  | Node.js, Fastify 5, Prisma, PostgreSQL       |
| **Frontend** | Next.js, React, TypeScript                   |
| **Testes**   | Vitest (unitários, integração, e2e)           |
| **Docs**     | Swagger UI (OpenAPI 3) — `@fastify/swagger`  |
| **Lint**     | ESLint + Prettier                            |

## Arquitetura

O backend segue princípios de **Clean Architecture** com separação em camadas:

```
backend/src/
├── domain/        → Entidades, Enums, Erros, Interfaces (zero dependências externas)
├── application/   → Use Cases, DTOs, Mappers (depende apenas do domain)
└── infra/         → Prisma, Controllers, Rotas, Plugins, Schemas (implementações concretas)
```

Os controllers recebem o repositório via **injeção de dependência**, o que permite substituir a implementação real (`PrismaDocumentRepository`) por mocks nos testes.

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

## Instalação

```bash
# 1. Subir o banco de dados (PostgreSQL 16 — porta 5433)
docker compose up -d

# 2. Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev                # → http://localhost:3333

# 3. Frontend
cd frontend
npm install
npm run dev                # → http://localhost:3000
```

## Documentação da API (Swagger)

Com o backend rodando, acesse:

```
http://localhost:3333/docs
```


## Endpoints

Todos os endpoints estão sob o prefixo `/api`.

| Método   | Rota                        | Descrição                          | Status Codes         |
|----------|-----------------------------|------------------------------------|----------------------|
| `POST`   | `/api/documents`            | Criar documento                    | `201`, `400`         |
| `GET`    | `/api/documents`            | Listar documentos (paginado)       | `200`                |
| `GET`    | `/api/documents/:id`        | Buscar por ID                      | `200`, `404`         |
| `PATCH`  | `/api/documents/:id/status` | Atualizar status (PENDENTE ↔ ASSINADO) | `200`, `404`     |
| `DELETE` | `/api/documents/:id`        | Deletar documento                  | `204`, `404`         |

### Query Params — `GET /api/documents`

| Param    | Tipo      | Default | Descrição                              |
|----------|-----------|---------|----------------------------------------|
| `page`   | `integer` | `1`     | Página atual                           |
| `limit`  | `integer` | `10`    | Itens por página (máx. 50)             |
| `status` | `string`  | —       | Filtrar por `PENDENTE` ou `ASSINADO`   |

## Testes

```bash
cd backend
npm run test               # Todos os testes
npm run test:unit          # Unitários
npm run test:integration   # Integração
npm run test:coverage      # Com cobertura
```

### Cobertura de Testes

| Tipo          | O que valida                                     | Arquivos                                 |
|---------------|--------------------------------------------------|------------------------------------------|
| **Unitário**  | Use Cases isolados, Mapper                       | `tests/unit/use-cases/`, `tests/unit/mappers/` |
| **Integração**| Rotas HTTP (request → response) com repo in-memory | `tests/integration/`                   |
| **E2E**       | Fluxo completo com banco real                    | `tests/e2e/`                             |

## Scripts Disponíveis

### Backend (`cd backend`)

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build de produção
npm run start          # Rodar build em produção
npm run lint           # Verificar lint (ESLint)
npm run format         # Formatar código (Prettier)
npm run prisma:migrate # Executar migrations
npm run prisma:seed    # Popular banco com dados iniciais
```

### Frontend (`cd frontend`)

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build de produção
npm run start          # Rodar build em produção
```
