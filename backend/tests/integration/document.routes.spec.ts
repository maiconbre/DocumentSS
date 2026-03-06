import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../helpers/test-server'

describe('Document Routes (Integration)', () => {
    let app: FastifyInstance

    beforeEach(async () => {
        const testApp = await buildTestApp()
        app = testApp.app
    })

    afterEach(async () => {
        await app.close()
    })

    // ─── POST /api/documents ──────────────────────────────────

    describe('POST /api/documents', () => {
        it('deve criar documento com body válido → 201', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: {
                    titulo: 'Contrato de Serviço',
                    descricao: 'Descrição do contrato',
                },
            })

            expect(response.statusCode).toBe(201)

            const body = response.json()
            expect(body.titulo).toBe('Contrato de Serviço')
            expect(body.descricao).toBe('Descrição do contrato')
            expect(body.status).toBe('PENDENTE')
            expect(body.id).toBeDefined()
            expect(body.criadoEm).toBeDefined()
        })
    })

    // ─── GET /api/documents ───────────────────────────────────

    describe('GET /api/documents', () => {
        it('deve retornar lista vazia → 200', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/documents',
            })

            expect(response.statusCode).toBe(200)

            const body = response.json()
            expect(body.data).toHaveLength(0)
            expect(body.meta.total).toBe(0)
        })

        it('deve retornar documentos existentes com paginação → 200', async () => {
            // Criar documentos via rota
            await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Doc 1' },
            })
            await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Doc 2' },
            })

            const response = await app.inject({
                method: 'GET',
                url: '/api/documents?page=1&limit=10',
            })

            expect(response.statusCode).toBe(200)

            const body = response.json()
            expect(body.data).toHaveLength(2)
            expect(body.meta.total).toBe(2)
            expect(body.meta.page).toBe(1)
        })
    })

    // ─── GET /api/documents/:id ───────────────────────────────

    describe('GET /api/documents/:id', () => {
        it('deve retornar documento encontrado → 200', async () => {
            const createResponse = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Contrato' },
            })
            const { id } = createResponse.json()

            const response = await app.inject({
                method: 'GET',
                url: `/api/documents/${id}`,
            })

            expect(response.statusCode).toBe(200)
            expect(response.json().titulo).toBe('Contrato')
        })

        it('deve retornar 404 para id inexistente', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/documents/550e8400-e29b-41d4-a716-446655440000',
            })

            expect(response.statusCode).toBe(404)

            const body = response.json()
            expect(body.error).toBe('Not Found')
        })
    })

    // ─── PATCH /api/documents/:id/status ──────────────────────

    describe('PATCH /api/documents/:id/status', () => {
        it('deve atualizar status válido → 200', async () => {
            const createResponse = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Contrato' },
            })
            const { id } = createResponse.json()

            const response = await app.inject({
                method: 'PATCH',
                url: `/api/documents/${id}/status`,
                payload: { status: 'ASSINADO' },
            })

            expect(response.statusCode).toBe(200)
            expect(response.json().status).toBe('ASSINADO')
        })

        it('deve retornar 404 para id inexistente', async () => {
            const response = await app.inject({
                method: 'PATCH',
                url: '/api/documents/550e8400-e29b-41d4-a716-446655440000/status',
                payload: { status: 'ASSINADO' },
            })

            expect(response.statusCode).toBe(404)
        })
    })

    // ─── DELETE /api/documents/:id ────────────────────────────

    describe('DELETE /api/documents/:id', () => {
        it('deve deletar documento existente → 204', async () => {
            const createResponse = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Documento para deletar' },
            })
            const { id } = createResponse.json()

            const response = await app.inject({
                method: 'DELETE',
                url: `/api/documents/${id}`,
            })

            expect(response.statusCode).toBe(204)
        })

        it('deve retornar 404 para id inexistente', async () => {
            const response = await app.inject({
                method: 'DELETE',
                url: '/api/documents/550e8400-e29b-41d4-a716-446655440000',
            })

            expect(response.statusCode).toBe(404)
        })

        it('documento deletado não deve aparecer na listagem', async () => {
            const createResponse = await app.inject({
                method: 'POST',
                url: '/api/documents',
                payload: { titulo: 'Documento temporário' },
            })
            const { id } = createResponse.json()

            await app.inject({
                method: 'DELETE',
                url: `/api/documents/${id}`,
            })

            const listResponse = await app.inject({
                method: 'GET',
                url: '/api/documents',
            })

            const body = listResponse.json()
            expect(body.data).toHaveLength(0)
        })
    })
})
