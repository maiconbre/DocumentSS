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
        const result = await this.createUseCase.execute(request.body)
        return reply.status(201).send(result)
    }

    async list(
        request: FastifyRequest<{
            Querystring: { page?: number; limit?: number; status?: string }
        }>,
        reply: FastifyReply,
    ) {
        const { page, limit, status } = request.query

        const result = await this.listUseCase.execute({
            page,
            limit,
            status: status as DocumentStatus | undefined,
        })

        return reply.status(200).send(result)
    }

    async getById(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const result = await this.getUseCase.execute(request.params.id)
        return reply.status(200).send(result)
    }

    async updateStatus(
        request: FastifyRequest<{
            Params: { id: string }
            Body: { status: DocumentStatus }
        }>,
        reply: FastifyReply,
    ) {
        const result = await this.updateStatusUseCase.execute(
            request.params.id,
            request.body,
        )
        return reply.status(200).send(result)
    }

    async delete(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        await this.deleteUseCase.execute(request.params.id)
        return reply.status(204).send()
    }

    async addFiles(
        request: FastifyRequest<{
            Params: { id: string }
            Body: { arquivos: { name: string; type: string; data: string }[] }
        }>,
        reply: FastifyReply,
    ) {
        const result = await this.addFilesUseCase.execute(
            request.params.id,
            request.body.arquivos,
        )
        return reply.status(200).send(result)
    }

    async getFiles(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply,
    ) {
        const files = await this.getFilesUseCase.execute(request.params.id)
        return reply.status(200).send(files)
    }

    async deleteFile(
        request: FastifyRequest<{ Params: { documentId: string; fileId: string } }>,
        reply: FastifyReply,
    ) {
        await this.deleteFileUseCase.execute(request.params.fileId)
        return reply.status(204).send()
    }
}
