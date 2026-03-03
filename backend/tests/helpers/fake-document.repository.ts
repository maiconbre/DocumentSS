import { Document } from '../../src/domain/entities/document.entity'
import { DocumentStatus } from '../../src/domain/enums/document-status.enum'
import {
    DocumentRepository,
    CreateDocumentData,
    FindAllParams,
    PaginatedResult,
} from '../../src/domain/repositories/document.repository'
import { randomUUID } from 'crypto'

export class FakeDocumentRepository implements DocumentRepository {
    private documents: Document[] = []

    async create(data: CreateDocumentData): Promise<Document> {
        const document = new Document({
            id: randomUUID(),
            titulo: data.titulo,
            descricao: data.descricao ?? null,
            status: DocumentStatus.PENDENTE,
            criadoEm: new Date(),
        })

        this.documents.push(document)
        return document
    }

    async findAll(params?: FindAllParams): Promise<PaginatedResult<Document>> {
        const page = params?.page ?? 1
        const limit = params?.limit ?? 10

        let filtered = [...this.documents]

        if (params?.status) {
            filtered = filtered.filter((d) => d.status === params.status)
        }

        const total = filtered.length
        const start = (page - 1) * limit
        const data = filtered.slice(start, start + limit)

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async findById(id: string): Promise<Document | null> {
        return this.documents.find((d) => d.id === id) ?? null
    }

    async updateStatus(id: string, status: DocumentStatus): Promise<Document> {
        const index = this.documents.findIndex((d) => d.id === id)

        const updated = new Document({
            ...this.documents[index],
            status,
        })

        this.documents[index] = updated
        return updated
    }

    async delete(id: string): Promise<void> {
        this.documents = this.documents.filter((d) => d.id !== id)
    }

    // Helper para testes
    clear() {
        this.documents = []
    }
}
