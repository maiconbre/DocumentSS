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
            arquivos: entity.arquivos?.map((f) => ({
                id: f.id,
                name: f.name,
                type: f.type,
                data: f.data,
            })),
        }
    }

    static toDomain(raw: {
        id: string
        titulo: string
        descricao: string | null
        status: DocumentStatus | string
        criadoEm: Date
    }): Document {
        const validStatuses = Object.values(DocumentStatus)
        const status = validStatuses.includes(raw.status as DocumentStatus)
            ? (raw.status as DocumentStatus)
            : DocumentStatus.PENDENTE

        return new Document({
            id: raw.id,
            titulo: raw.titulo,
            descricao: raw.descricao,
            status,
            criadoEm: raw.criadoEm,
        })
    }

    static toDomainWithFiles(raw: {
        id: string
        titulo: string
        descricao: string | null
        status: DocumentStatus | string
        criadoEm: Date
        arquivos?: { id: string; name: string; type: string; data: string }[]
    }): Document {
        const validStatuses = Object.values(DocumentStatus)
        const status = validStatuses.includes(raw.status as DocumentStatus)
            ? (raw.status as DocumentStatus)
            : DocumentStatus.PENDENTE

        return new Document({
            id: raw.id,
            titulo: raw.titulo,
            descricao: raw.descricao,
            status,
            criadoEm: raw.criadoEm,
            arquivos: raw.arquivos?.map((f) => ({
                id: f.id,
                name: f.name,
                type: f.type,
                data: f.data,
            })),
        })
    }
}
