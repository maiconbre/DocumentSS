import { DocumentRepository } from '@domain/repositories/document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'
import { DocumentFileDTO } from '../dtos/validation.schema'

export class GetFilesUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(documentId: string): Promise<DocumentFileDTO[]> {
        const doc = await this.repository.findById(documentId)
        if (!doc) throw new DocumentNotFoundError(documentId)

        return this.repository.getFiles(documentId) as Promise<DocumentFileDTO[]>
    }
}
