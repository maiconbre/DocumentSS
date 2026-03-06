import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { registerErrorHandler } from '../../src/infra/http/middlewares/error-handler'
import { registerDocumentRoutes } from '../../src/infra/http/routes/document.routes'
import { PrismaDocumentRepository } from '../../src/infra/repositories/prisma-document.repository'

/**
 * Teste E2E — usa banco PostgreSQL real.
 * Requer DATABASE_URL configurada e banco acessível.
 *
 * Rodar com: npm run test:e2e
 */
describe('Document Routes (E2E - Banco Real)', () => {
    let app: FastifyInstance
    let prisma: PrismaClient

    beforeAll(async () => {
        prisma = new PrismaClient()
        await prisma.$connect()

        // Limpa tabela antes dos testes
        await prisma.document.deleteMany()

        const repository = new PrismaDocumentRepository(prisma)

        app = Fastify({ logger: false })
        registerErrorHandler(app)

        await app.register(async (instance) => {
            registerDocumentRoutes(instance, repository)
        }, { prefix: '/api' })

        await app.ready()
    })

    afterAll(async () => {
        await prisma.document.deleteMany()
        await prisma.$disconnect()
        await app.close()
    })

    it('deve criar, buscar, atualizar e deletar um documento (fluxo completo)', async () => {
        // 1. Criar documento
        const createRes = await app.inject({
            method: 'POST',
            url: '/api/documents',
            payload: { titulo: 'Contrato E2E', descricao: 'Teste com banco real' },
        })
        expect(createRes.statusCode).toBe(201)
        const doc = createRes.json()
        expect(doc.titulo).toBe('Contrato E2E')
        expect(doc.status).toBe('PENDENTE')
        expect(doc.id).toBeDefined()

        // 2. Buscar por ID
        const getRes = await app.inject({
            method: 'GET',
            url: `/api/documents/${doc.id}`,
        })
        expect(getRes.statusCode).toBe(200)
        expect(getRes.json().titulo).toBe('Contrato E2E')

        // 3. Atualizar status
        const patchRes = await app.inject({
            method: 'PATCH',
            url: `/api/documents/${doc.id}/status`,
            payload: { status: 'ASSINADO' },
        })
        expect(patchRes.statusCode).toBe(200)
        expect(patchRes.json().status).toBe('ASSINADO')

        // 4. Verificar na listagem
        const listRes = await app.inject({
            method: 'GET',
            url: '/api/documents',
        })
        expect(listRes.statusCode).toBe(200)
        const listBody = listRes.json()
        expect(listBody.data.length).toBeGreaterThanOrEqual(1)

        // 5. Deletar
        const deleteRes = await app.inject({
            method: 'DELETE',
            url: `/api/documents/${doc.id}`,
        })
        expect(deleteRes.statusCode).toBe(204)

        // 6. Confirmar deleção
        const getDeletedRes = await app.inject({
            method: 'GET',
            url: `/api/documents/${doc.id}`,
        })
        expect(getDeletedRes.statusCode).toBe(404)
    })

    it('deve persistir dados no banco PostgreSQL', async () => {
        // Cria via API
        const res = await app.inject({
            method: 'POST',
            url: '/api/documents',
            payload: { titulo: 'Persistência E2E' },
        })
        const doc = res.json()

        // Verifica diretamente no banco via Prisma
        const dbDoc = await prisma.document.findUnique({
            where: { id: doc.id },
        })

        expect(dbDoc).not.toBeNull()
        expect(dbDoc!.titulo).toBe('Persistência E2E')
        expect(dbDoc!.status).toBe('PENDENTE')

        // Cleanup
        await prisma.document.delete({ where: { id: doc.id } })
    })

})
