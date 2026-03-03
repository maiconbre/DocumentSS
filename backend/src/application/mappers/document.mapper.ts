import { Document } from '../../domain/entities/document.entity'
import { DocumentStatus } from '../../domain/enums/document-status.enum'
import { DocumentResponseDTO } from '../dtos/document-response.dto'

export class DocumentMapper {
    static toResponse(entity: Document): DocumentResponseDTO {
        return {
            id: entity.id,
            titulo: entity.titulo,
            descricao: entity.descricao,
            status: entity.status,
            criadoEm: entity.criadoEm.toISOString(),
        }
    }

    static toDomain(raw: {
        id: string
        titulo: string
        descricao: string | null
        status: DocumentStatus
        criadoEm: Date
    }): Document {
        return new Document({
            id: raw.id,
            titulo: raw.titulo,
            descricao: raw.descricao,
            status: raw.status,
            criadoEm: raw.criadoEm,
        })
    }
}
