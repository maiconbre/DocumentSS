import { Document } from '@domain/entities/document.entity'
import { DocumentStatus } from '@domain/enums/document-status.enum'
import {
    DocumentRepository,
    CreateDocumentData,
    CreateFileData,
    FindAllParams,
    PaginatedResult,
} from '@domain/repositories/document.repository'
import { randomUUID } from 'crypto'

interface StoredFile extends CreateFileData {
    id: string
    documentId: string
}

export class FakeDocumentRepository implements DocumentRepository {
    private documents: Document[] = []
    private files: StoredFile[] = []

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
        const doc = this.documents.find((d) => d.id === id)
        if (!doc) return null

        // Retorna o documento com seus arquivos associados
        const docFiles = this.files
            .filter((f) => f.documentId === id)
            .map(({ id: fileId, name, type, data }) => ({ id: fileId, name, type, data }))

        return new Document({
            id: doc.id,
            titulo: doc.titulo,
            descricao: doc.descricao,
            status: doc.status,
            criadoEm: doc.criadoEm,
            arquivos: docFiles.length > 0 ? docFiles : undefined,
        })
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
        this.files = this.files.filter((f) => f.documentId !== id)
    }

    async addFiles(documentId: string, files: CreateFileData[]): Promise<void> {
        for (const file of files) {
            this.files.push({
                id: randomUUID(),
                documentId,
                ...file,
            })
        }
    }

    async getFiles(documentId: string): Promise<{ id: string; name: string; type: string; data: string }[]> {
        return this.files
            .filter((f) => f.documentId === documentId)
            .map(({ id, name, type, data }) => ({ id, name, type, data }))
    }

    async deleteFile(fileId: string): Promise<void> {
        this.files = this.files.filter((f) => f.id !== fileId)
    }

    // Helper para testes
    clear() {
        this.documents = []
        this.files = []
    }
}
