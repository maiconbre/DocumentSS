# DocumentSS — Gerenciamento de Documentos

> API RESTful + Interface Web simples para gerenciamento de documentos, construída como teste prático fullstack com **Clean Architecture** e **Testes Automatizados**.

---

## Stack

| Camada | Tecnologias |
|---|---|
| **Backend** | Node.js · Fastify 5 · Prisma ORM · PostgreSQL · Zod |
| **Frontend** | Next.js 16 · React 19 · TypeScript · CSS Modules |
| **Testes** | Vitest — unitários, integração, e2e (63 testes) |
| **Docs** | Swagger UI (OpenAPI 3) via `@fastify/swagger` |
| **Infra** | Docker Compose · ESLint · Prettier |

---

## Arquitetura

### Backend — Clean Architecture

```
backend/src/
├── domain/                    # Camada de domínio — zero dependências externas
│   ├── entities/              # Entidades de negócio
│   ├── enums/                 # Enums (DocumentStatus)
│   ├── errors/                # Custom errors
│   └── repositories/          # Interfaces de repositório
├── application/               # Lógica de aplicação — depende apenas de domain/
│   ├── dtos/validation.schema.ts  # DTOs e schemas
│   ├── use-cases/             # Orquestração de operações
│   └── mappers/               # Conversão entity → DTO
└── infra/                     # Implementações concretas
    ├── config/                # Env, Logger
    ├── database/              # Prisma Client
    ├── repositories/          # PrismaDocumentRepository
    └── http/
        ├── controllers/       # Handlers HTTP
        ├── middlewares/       # Error handler global
        ├── plugins/           # CORS, Swagger
        ├── routes/            # Registro de rotas
        └── schemas/           # Schemas Swagger
```

### Frontend

```
frontend/src/
├── app/                   # Next.js App Router
├── components/
│   ├── ui/                # Componentes reutilizáveis
│   ├── documents/         # Features (List, Form, Upload)
│   └── layout/            # Layout compartilhado
├── hooks/                 # Custom hooks
├── services/              # Client HTTP
└── types/                 # Tipos compartilhados
```

---

## Instalação

**Pré-requisitos:** Node.js 18+ e Docker

```bash
# 1. Banco de dados (PostgreSQL 16 — porta 5433)
docker compose up -d

# 2. Backend
cd backend
npm install
npm run prisma:migrate       # ou 'npx prisma migrate dev'
npm run prisma:seed          # Popula com 10 documentos de exemplo
npm run dev                  # → http://localhost:3333

# 3. Frontend
cd frontend
npm install
npm run dev                  # → http://localhost:3000
```

---

## Documentação da API

Com o backend rodando, acesse o Swagger UI:

```
http://localhost:3333/docs
```

---

## Endpoints

Prefixo: `/api`

### Documentos

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `POST` | `/api/documents` | Criar documento | `201` `400` |
| `GET` | `/api/documents` | Listar (paginado, filtrável) | `200` |
| `GET` | `/api/documents/:id` | Buscar por ID | `200` `404` |
| `PATCH` | `/api/documents/:id/status` | Atualizar status | `200` `400` `404` |
| `DELETE` | `/api/documents/:id` | Deletar documento | `204` `404` |


---

## Testes

```bash
cd backend

npm run test              # Todos os testes (63)
npm run test:unit         # Unitários (43)
npm run test:integration  # Integração (18)
npm run test:coverage     # Com cobertura
```

### Cobertura

| Tipo | Escopo | Testes |
|---|---|---|
| **Unitário** | Use Cases (8), Mapper, Validation Schemas (consolidados) | 43 |
| **Integração** | Rotas HTTP com repo in-memory | 18 |
| **E2E** | Fluxo completo, persistência em banco real | 2 |
| | **Total** | **63** |

---



## Scripts

### Backend

```bash
npm run dev              # Desenvolvimento com watch
npm run build            # Build de produção (tsup)
npm run start            # Executar build
npm run test             # Rodar todos os testes
npm run test:unit        # Só unitários
npm run test:coverage    # Cobertura de testes
npm run lint             # Verificar com ESLint
npm run lint:fix         # Corrigir issues automaticamente
npm run format           # Formatar com Prettier
npm run prisma:migrate   # Executar migrations (dev)
npm run prisma:seed      # Popular banco com dados de exemplo
```

### Frontend

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run start            # Produção (serve build)
npm run lint             # ESLint check
```

---

<sub>Desenvolvido por **Maicon Brendon** · Teste técnico fullstack · Node.js + Fastify + Prisma + Next.js · 2026</sub>
