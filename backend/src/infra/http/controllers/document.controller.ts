import { FastifyReply } from 'fastify'
import { DocumentRepository } from '@domain/repositories/document.repository'
import {
    CreateDocumentRequest,
    ListDocumentsQuery,
    DocumentIdParam,
    UpdateDocumentStatusRequest,
    AddFilesRequest,
} from '@application/dtos/validation.schema'
import { DocumentStatus } from '@domain/enums/document-status.enum'
import { CreateDocumentUseCase } from '@application/use-cases/create-document.use-case'
import { ListDocumentsUseCase } from '@application/use-cases/list-documents.use-case'
import { GetDocumentUseCase } from '@application/use-cases/get-document.use-case'
import { UpdateDocumentStatusUseCase } from '@application/use-cases/update-document-status.use-case'
import { DeleteDocumentUseCase } from '@application/use-cases/delete-document.use-case'
import { AddFilesUseCase } from '@application/use-cases/add-files.use-case'
import { GetFilesUseCase } from '@application/use-cases/get-files.use-case'
import { DeleteFileUseCase } from '@application/use-cases/delete-file.use-case'

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

    async create(body: CreateDocumentRequest, reply: FastifyReply) {
        const result = await this.createUseCase.execute(body)
        return reply.status(201).send(result)
    }

    async list(query: ListDocumentsQuery, reply: FastifyReply) {
        const result = await this.listUseCase.execute({
            page: query.page,
            limit: query.limit,
            status: query.status as DocumentStatus | undefined,
        })

        return reply.status(200).send(result)
    }

    async getById(params: DocumentIdParam, reply: FastifyReply) {
        const result = await this.getUseCase.execute(params.id)
        return reply.status(200).send(result)
    }

    async updateStatus(params: DocumentIdParam, body: UpdateDocumentStatusRequest, reply: FastifyReply) {
        const result = await this.updateStatusUseCase.execute(
            params.id,
            body,
        )
        return reply.status(200).send(result)
    }

    async delete(params: DocumentIdParam, reply: FastifyReply) {
        await this.deleteUseCase.execute(params.id)
        return reply.status(204).send()
    }

    async addFiles(params: DocumentIdParam, body: AddFilesRequest, reply: FastifyReply) {
        const result = await this.addFilesUseCase.execute(
            params.id,
            body.arquivos,
        )
        return reply.status(200).send(result)
    }

    async getFiles(params: DocumentIdParam, reply: FastifyReply) {
        const files = await this.getFilesUseCase.execute(params.id)
        return reply.status(200).send(files)
    }

    async deleteFile(params: { id: string, fileId: string }, reply: FastifyReply) {
        await this.deleteFileUseCase.execute(params.fileId)
        return reply.status(204).send()
    }
}
