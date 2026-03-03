import { Document } from '../entities/document.entity'
import { DocumentStatus } from '../enums/document-status.enum'

export interface CreateDocumentData {
    titulo: string
    descricao?: string
}

export interface FindAllParams {
    page?: number
    limit?: number
    status?: DocumentStatus
}

export interface PaginatedResult<T> {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export interface DocumentRepository {
    create(data: CreateDocumentData): Promise<Document>
    findAll(params?: FindAllParams): Promise<PaginatedResult<Document>>
    findById(id: string): Promise<Document | null>
    updateStatus(id: string, status: DocumentStatus): Promise<Document>
    delete(id: string): Promise<void>
}
