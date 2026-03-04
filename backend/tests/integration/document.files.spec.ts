import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../helpers/test-server'

describe('Document Files Routes (Integration)', () => {
    let app: FastifyInstance

    beforeEach(async () => {
        const testApp = await buildTestApp()
        app = testApp.app
    })

    afterEach(async () => {
        await app.close()
    })

    // ─── Helpers ──────────────────────────────────────────────

    async function createDocument(titulo = 'Contrato de Teste') {
        const response = await app.inject({
            method: 'POST',
            url: '/api/documents',
            payload: { titulo },
        })
        return response.json() as { id: string }
    }

    const mockFile = {
        name: 'contrato.pdf',
        type: 'application/pdf',
        data: 'data:application/pdf;base64,JVBERi0xLjQKdGVzdA==',
    }

    // ─── POST /api/documents/:id/files ────────────────────────

    describe('POST /api/documents/:id/files', () => {
        it('deve adicionar arquivos a um documento existente → 200', async () => {
            const { id } = await createDocument()

            const response = await app.inject({
                method: 'POST',
                url: `/api/documents/${id}/files`,
                payload: { arquivos: [mockFile] },
            })

            expect(response.statusCode).toBe(200)

            const body = response.json()
            expect(body.id).toBe(id)
            expect(body.arquivos).toHaveLength(1)
            expect(body.arquivos[0].name).toBe('contrato.pdf')
            expect(body.arquivos[0].type).toBe('application/pdf')
        })

        it('deve retornar 404 ao adicionar arquivos a documento inexistente', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/api/documents/550e8400-e29b-41d4-a716-446655440000/files',
                payload: { arquivos: [mockFile] },
            })

            expect(response.statusCode).toBe(404)
        })

        it('deve retornar 400 com body inválido (sem arquivos)', async () => {
            const { id } = await createDocument()

            const response = await app.inject({
                method: 'POST',
                url: `/api/documents/${id}/files`,
                payload: {},
            })

            expect(response.statusCode).toBe(400)
        })
    })

    // ─── GET /api/documents/:id/files ─────────────────────────

    describe('GET /api/documents/:id/files', () => {
        it('deve listar arquivos do documento → 200', async () => {
            const { id } = await createDocument()

            // Adicionar arquivo primeiro
            await app.inject({
                method: 'POST',
                url: `/api/documents/${id}/files`,
                payload: { arquivos: [mockFile] },
            })

            const response = await app.inject({
                method: 'GET',
                url: `/api/documents/${id}/files`,
            })

            expect(response.statusCode).toBe(200)

            const files = response.json()
            expect(Array.isArray(files)).toBe(true)
            expect(files).toHaveLength(1)
            expect(files[0].name).toBe('contrato.pdf')
        })

        it('deve retornar lista vazia quando documento não tem arquivos → 200', async () => {
            const { id } = await createDocument()

            const response = await app.inject({
                method: 'GET',
                url: `/api/documents/${id}/files`,
            })

            expect(response.statusCode).toBe(200)
            expect(response.json()).toHaveLength(0)
        })

        it('deve retornar 404 para documento inexistente', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/api/documents/550e8400-e29b-41d4-a716-446655440000/files',
            })

            expect(response.statusCode).toBe(404)
        })
    })

    // ─── DELETE /api/documents/:documentId/files/:fileId ──────

    describe('DELETE /api/documents/:documentId/files/:fileId', () => {
        it('deve deletar arquivo existente → 204', async () => {
            const { id: documentId } = await createDocument()

            // Adicionar e obter o id do arquivo
            const addResponse = await app.inject({
                method: 'POST',
                url: `/api/documents/${documentId}/files`,
                payload: { arquivos: [mockFile] },
            })

            const doc = addResponse.json()
            const fileId = doc.arquivos[0].id

            const response = await app.inject({
                method: 'DELETE',
                url: `/api/documents/${documentId}/files/${fileId}`,
            })

            expect(response.statusCode).toBe(204)
        })

        it('arquivo deletado não deve aparecer na listagem', async () => {
            const { id: documentId } = await createDocument()

            const addResponse = await app.inject({
                method: 'POST',
                url: `/api/documents/${documentId}/files`,
                payload: { arquivos: [mockFile] },
            })

            const doc = addResponse.json()
            const fileId = doc.arquivos[0].id

            await app.inject({
                method: 'DELETE',
                url: `/api/documents/${documentId}/files/${fileId}`,
            })

            const listResponse = await app.inject({
                method: 'GET',
                url: `/api/documents/${documentId}/files`,
            })

            expect(listResponse.json()).toHaveLength(0)
        })
    })
})
