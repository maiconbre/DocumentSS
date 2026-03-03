import { DocumentRepository } from '../../domain/repositories/document.repository'
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error'
import { UpdateDocumentStatusDTO } from '../dtos/update-document-status.dto'
import { DocumentResponseDTO } from '../dtos/document-response.dto'
import { DocumentMapper } from '../mappers/document.mapper'

export class UpdateDocumentStatusUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(id: string, dto: UpdateDocumentStatusDTO): Promise<DocumentResponseDTO> {
        const existing = await this.repository.findById(id)

        if (!existing) {
            throw new DocumentNotFoundError(id)
        }

        // Usa métodos de domínio para verificar estado atual
        const entity = DocumentMapper.toDomain(existing)

        if (entity.status === dto.status) {
            // Já está no status desejado — retorna sem atualizar
            return DocumentMapper.toResponse(entity)
        }

        const updated = await this.repository.updateStatus(id, dto.status)

        return DocumentMapper.toResponse(updated)
    }
}
