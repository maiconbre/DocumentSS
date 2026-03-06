import { DocumentRepository, CreateFileData } from '@domain/repositories/document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'
import { DocumentResponseDTO } from '../dtos/validation.schema'
import { DocumentMapper } from '../mappers/document.mapper'

export class AddFilesUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(documentId: string, arquivos: CreateFileData[]): Promise<DocumentResponseDTO> {
        const doc = await this.repository.findById(documentId)
        if (!doc) throw new DocumentNotFoundError(documentId)

        await this.repository.addFiles(documentId, arquivos)

        const updated = await this.repository.findById(documentId)
        if (!updated) throw new DocumentNotFoundError(documentId)
        return DocumentMapper.toResponse(updated)
    }
}

