import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DocumentController } from '../controllers/document.controller'
import { DocumentRepository } from '@domain/repositories/document.repository'
import { PrismaDocumentRepository } from '../../repositories/prisma-document.repository'
import { prisma } from '../../database/prisma-client'
import {
    CreateDocumentRequestSchema,
    UpdateDocumentStatusRequestSchema,
    AddFilesRequestSchema,
    ListDocumentsQuerySchema,
    DocumentIdParamSchema,
    DocumentResponseSchema,
    DocumentListResponseSchema,
    DocumentFileResponseSchema
} from '@application/dtos/validation.schema'

export function registerDocumentRoutes(app: FastifyInstance, repository: DocumentRepository) {
    const controller = new DocumentController(repository)
    const typedApp = app.withTypeProvider<ZodTypeProvider>()

    typedApp.post(
        '/documents',
        {
            schema: {
                tags: ['Documents'],
                summary: 'Criar documento',
                description: 'Cria um novo documento com status PENDENTE',
                body: CreateDocumentRequestSchema,
                response: { 201: DocumentResponseSchema },
            },
        },
        async (request, reply) => controller.create(request.body, reply),
    )

    typedApp.get(
        '/documents',
        {
            schema: {
                tags: ['Documents'],
                summary: 'Listar documentos',
                description: 'Lista documentos com paginação e filtro por status',
                querystring: ListDocumentsQuerySchema,
                response: { 200: DocumentListResponseSchema },
            },
        },
        async (request, reply) => controller.list(request.query, reply),
    )

    typedApp.get(
        '/documents/:id',
        {
            schema: {
                tags: ['Documents'],
                summary: 'Buscar documento por ID',
                params: DocumentIdParamSchema,
                response: { 200: DocumentResponseSchema },
            },
        },
        async (request, reply) => controller.getById(request.params, reply),
    )

    typedApp.patch(
        '/documents/:id/status',
        {
            schema: {
                tags: ['Documents'],
                summary: 'Atualizar status do documento',
                description: 'Atualiza o status de um documento (PENDENTE ↔ ASSINADO)',
                params: DocumentIdParamSchema,
                body: UpdateDocumentStatusRequestSchema,
                response: { 200: DocumentResponseSchema },
            },
        },
        async (request, reply) => controller.updateStatus(request.params, request.body, reply),
    )

    typedApp.delete(
        '/documents/:id',
        {
            schema: {
                tags: ['Documents'],
                summary: 'Deletar documento',
                params: DocumentIdParamSchema,
                response: { 204: z.null() },
            },
        },
        async (request, reply) => controller.delete(request.params, reply),
    )

    typedApp.post(
        '/documents/:id/files',
        {
            schema: {
                tags: ['Files'],
                summary: 'Adicionar arquivos ao documento',
                description: 'Adiciona um ou mais arquivos (Base64) a um documento existente',
                params: DocumentIdParamSchema,
                body: AddFilesRequestSchema,
                response: { 200: DocumentResponseSchema },
            },
        },
        async (request, reply) => controller.addFiles(request.params, request.body, reply),
    )

    typedApp.get(
        '/documents/:id/files',
        {
            schema: {
                tags: ['Files'],
                summary: 'Listar arquivos do documento',
                description: 'Retorna todos os arquivos vinculados a um documento',
                params: DocumentIdParamSchema,
                response: { 200: z.array(DocumentFileResponseSchema) },
            },
        },
        async (request, reply) => controller.getFiles(request.params, reply),
    )

    typedApp.delete(
        '/documents/:id/files/:fileId',
        {
            schema: {
                tags: ['Files'],
                summary: 'Deletar arquivo',
                description: 'Remove um arquivo específico de um documento',
                params: DocumentIdParamSchema.extend({
                    fileId: z.string().uuid('ID deve ser um UUID válido'),
                }),
                response: { 204: z.null() },
            },
        },
        async (request, reply) => controller.deleteFile(request.params, reply),
    )
}

export async function documentRoutes(app: FastifyInstance) {
    const repository = new PrismaDocumentRepository(prisma)
    registerDocumentRoutes(app, repository)
}
