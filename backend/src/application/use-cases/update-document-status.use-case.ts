import { DocumentRepository } from '../../domain/repositories/document.repository'
import { DocumentNotFoundError } from '../../domain/errors/document-not-found.error'
import { UpdateDocumentStatusDTO, DocumentResponseDTO } from '../dtos/validation.schema'
import { DocumentMapper } from '../mappers/document.mapper'

export class UpdateDocumentStatusUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(id: string, dto: UpdateDocumentStatusDTO): Promise<DocumentResponseDTO> {
        const existing = await this.repository.findById(id)

        if (!existing) {
            throw new DocumentNotFoundError(id)
        }

        // Usa métodos de domínio para verificar estado atual
        if (existing.isPendente() && dto.status === existing.status) {
            return DocumentMapper.toResponse(existing)
        }

        if (existing.isAssinado() && dto.status === existing.status) {
            // Já está no status desejado — retorna sem atualizar
            return DocumentMapper.toResponse(existing)
        }

        const updated = await this.repository.updateStatus(id, dto.status)

        return DocumentMapper.toResponse(updated)
    }
}
