import { DocumentRepository } from '../../domain/repositories/document.repository'
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error'
import { DocumentResponseDTO } from '../dtos/validation.schema'
import { DocumentMapper } from '../mappers/document.mapper'

export class GetDocumentUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(id: string): Promise<DocumentResponseDTO> {
        const document = await this.repository.findById(id)

        if (!document) {
            throw new DocumentNotFoundError(id)
        }

        return DocumentMapper.toResponse(document)
    }
}
