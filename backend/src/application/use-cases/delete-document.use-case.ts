import { DocumentRepository } from '@domain/repositories/document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'
import { DocumentCannotBeDeletedError } from '@domain/errors/document-cannot-be-deleted.error'

export class DeleteDocumentUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(id: string): Promise<void> {
        const existing = await this.repository.findById(id)

        if (!existing) {
            throw new DocumentNotFoundError(id)
        }

        if (existing.status === 'ASSINADO') {
            throw new DocumentCannotBeDeletedError()
        }

        await this.repository.delete(id)
    }
}

