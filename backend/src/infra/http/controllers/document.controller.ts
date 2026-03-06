import { FastifyRequest, FastifyReply } from 'fastify'
import { DocumentRepository } from '../../../domain/repositories/document.repository'
import { DocumentStatus } from '../../../domain/enums/document-status.enum'
import { CreateDocumentUseCase } from '../../../application/use-cases/create-document.use-case'
import { ListDocumentsUseCase } from '../../../application/use-cases/list-documents.use-case'
import { GetDocumentUseCase } from '../../../application/use-cases/get-document.use-case'
import { UpdateDocumentStatusUseCase } from '../../../application/use-cases/update-document-status.use-case'
import { DeleteDocumentUseCase } from '../../../application/use-cases/delete-document.use-case'
import { AddFilesUseCase } from '../../../application/use-cases/add-files.use-case'
import { GetFilesUseCase } from '../../../application/use-cases/get-files.use-case'
import { DeleteFileUseCase } from '../../../application/use-cases/delete-file.use-case'
import {
    CreateDocumentRequestSchema,
    UpdateDocumentStatusRequestSchema,
    AddFilesRequestSchema,
    ListDocumentsQuerySchema,
    DocumentIdParamSchema,
} from '../../../application/dtos/validation.schema'
import { validateOrThrow } from '../../../application/validators/validate'
import { InvalidDocumentStatusError, MissingParamError } from '../../../domain/errors/validation.error'

export class DocumentController {
    private readonly createUseCase: CreateDocumentUseCase
    private readonly listUseCase: ListDocumentsUseCase
    private readonly getUseCase: GetDocumentUseCase
    private readonly updateStatusUseCase: UpdateDocumentStatusUseCase
    private readonly deleteUseCase: DeleteDocumentUseCase
    private readonly addFilesUseCase: AddFilesUseCase
    private readonly getFilesUseCase: GetFilesUseCase
    private readonly deleteFileUseCase: DeleteFileUseCase

    constructor(private readonly repository: DocumentRepository) {
        this.createUseCase = new CreateDocumentUseCase(repository)
        this.listUseCase = new ListDocumentsUseCase(repository)
        this.getUseCase = new GetDocumentUseCase(repository)
        this.updateStatusUseCase = new UpdateDocumentStatusUseCase(repository)
        this.deleteUseCase = new DeleteDocumentUseCase(repository)
        this.addFilesUseCase = new AddFilesUseCase(repository)
        this.getFilesUseCase = new GetFilesUseCase(repository)
        this.deleteFileUseCase = new DeleteFileUseCase(repository)
    }

    async create(
        request: FastifyRequest<{ Body: { titulo: string; descricao?: string } }>,
        reply: FastifyReply,
    ) {
        const validatedData = validateOrThrow(
            CreateDocumentRequestSchema,
            request.body,
        )

        const result = await this.createUseCase.execute(validatedData)
        return reply.status(201).send(result)
    }

    async list(
        request: FastifyRequest<{
            Querystring: { page?: number; limit?: number; status?: string }
        }>,
        reply: FastifyReply,
    ) {
        const validatedQuery = validateOrThrow(
            ListDocumentsQuerySchema,
            request.query,
        )

        const result = await this.listUseCase.execute({
            page: validatedQuery.page,
            limit: validatedQuery.limit,
            status: validatedQuery.status as DocumentStatus | undefined,
        })

        return reply.status(200).send(result)
    }

    async getById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(DocumentIdParamSchema, request.params)

        const result = await this.getUseCase.execute(validatedParams.id)
        return reply.status(200).send(result)
    }

    async updateStatus(
        request: FastifyRequest<{
            Params: { id: string }
            Body: { status: DocumentStatus }
        }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(DocumentIdParamSchema, request.params)
        const validatedBody = validateOrThrow(
            UpdateDocumentStatusRequestSchema,
            request.body,
        )

        const result = await this.updateStatusUseCase.execute(
            validatedParams.id,
            validatedBody,
        )
        return reply.status(200).send(result)
    }

    async delete(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(DocumentIdParamSchema, request.params)

        await this.deleteUseCase.execute(validatedParams.id)
        return reply.status(204).send()
    }

    async addFiles(
        request: FastifyRequest<{
            Params: { id: string }
            Body: { arquivos: { name: string; type: string; data: string }[] }
        }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(DocumentIdParamSchema, request.params)
        const validatedBody = validateOrThrow(AddFilesRequestSchema, request.body)

        const result = await this.addFilesUseCase.execute(
            validatedParams.id,
            validatedBody.arquivos,
        )
        return reply.status(200).send(result)
    }

    async getFiles(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(DocumentIdParamSchema, request.params)

        const files = await this.getFilesUseCase.execute(validatedParams.id)
        return reply.status(200).send(files)
    }

    async deleteFile(
        request: FastifyRequest<{ Params: { documentId: string; fileId: string } }>,
        reply: FastifyReply,
    ) {
        const validatedParams = validateOrThrow(
            DocumentIdParamSchema.pick({ id: true }).extend({
                fileId: DocumentIdParamSchema.shape.id,
            }),
            { id: request.params.documentId, fileId: request.params.fileId },
        )

        await this.deleteFileUseCase.execute(validatedParams.fileId)
        return reply.status(204).send()
    }
}
