import { FastifyInstance } from 'fastify'
import { DocumentController } from '../controllers/document.controller'
import { DocumentRepository } from '../../../domain/repositories/document.repository'
import { PrismaDocumentRepository } from '../../repositories/prisma-document.repository'
import { prisma } from '../../database/prisma-client'
import { DocumentStatus } from '../../../domain/enums/document-status.enum'
import {
    createDocumentSchema,
    getDocumentSchema,
    updateDocumentStatusSchema,
    deleteDocumentSchema,
    listDocumentsSchema,
} from '../schemas/document.schema'

/**
 * Registra as rotas de documentos na instância Fastify.
 * Aceita um repositório injetável para facilitar testes.
 */
export function registerDocumentRoutes(app: FastifyInstance, repository: DocumentRepository) {
    const controller = new DocumentController(repository)

    app.post<{ Body: { titulo: string; descricao?: string } }>(
        '/documents',
        { schema: createDocumentSchema },
        (request, reply) => controller.create(request, reply),
    )

    app.get<{ Querystring: { page?: number; limit?: number; status?: string } }>(
        '/documents',
        { schema: listDocumentsSchema },
        (request, reply) => controller.list(request, reply),
    )

    app.get<{ Params: { id: string } }>(
        '/documents/:id',
        { schema: getDocumentSchema },
        (request, reply) => controller.getById(request, reply),
    )

    app.patch<{ Params: { id: string }; Body: { status: DocumentStatus } }>(
        '/documents/:id/status',
        { schema: updateDocumentStatusSchema },
        (request, reply) => controller.updateStatus(request, reply),
    )

    app.delete<{ Params: { id: string } }>(
        '/documents/:id',
        { schema: deleteDocumentSchema },
        (request, reply) => controller.delete(request, reply),
    )
}

/** Plugin Fastify para produção — usa PrismaDocumentRepository */
export async function documentRoutes(app: FastifyInstance) {
    const repository = new PrismaDocumentRepository(prisma)
    registerDocumentRoutes(app, repository)
}
