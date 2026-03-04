# DocumentSS — Gerenciamento de Documentos

> API RESTful + Interface Web simples para gerenciamento de documentos, construída como teste prático fullstack.

---

## Stack

| Camada | Tecnologias |
|---|---|
| **Backend** | Node.js · Fastify 5 · Prisma ORM · PostgreSQL |
| **Frontend** | Next.js 14 · React · TypeScript · CSS Modules |
| **Testes** | Vitest — unitários, integração, e2e (45 testes) |
| **Docs** | Swagger UI (OpenAPI 3) via `@fastify/swagger` |
| **Infra** | Docker Compose · ESLint · Prettier |

---

## Arquitetura

O backend segue **Clean Architecture** com separação estrita de camadas:

```
backend/src/
├── domain/       # Entidades, Enums, Erros, Interfaces — zero dependências externas
├── application/  # Use Cases, DTOs, Mappers — depende apenas de domain/
└── infra/        # Prisma, Controllers, Routes, Schemas — implementações concretas
```


```
frontend/src/
├── components/
│   ├── ui/        # Modal, ConfirmModal, Toast, StatusBadge
│   ├── documents/ # DocumentForm, DocumentList, DocumentViewer, FileUpload, SignatureModal
│   └── layout/    # AppLayout (sidebar responsiva)
├── hooks/         # useDocuments, useModal, useToast
├── services/      # api.ts — 7 métodos tipados
└── types/         # Tipos compartilhados frontend ↔ API
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

npm run test              # Todos os testes (45)
npm run test:unit         # Unitários
npm run test:integration  # Integração
npm run test:coverage     # Com relatório de cobertura
```

### Cobertura

| Tipo | Escopo | Testes |
|---|---|---|
| **Unitário** | Use Cases (8), Mapper | 20 |
| **Integração** | Rotas HTTP com repo in-memory | 20 |
| **E2E** | Fluxo completo com banco real | 2 |
| | **Total** | **45** |

---



## Scripts

### Backend

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run start            # Produção
npm run lint             # ESLint
npm run format           # Prettier
npm run prisma:migrate   # Executar migrations
npm run prisma:seed      # Popular banco
```

### Frontend

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm run start            # Produção
```

---

<sub>Desenvolvido por **Maicon Brendon** · Teste técnico fullstack · Node.js + Fastify + Prisma + Next.js · 2026</sub>
