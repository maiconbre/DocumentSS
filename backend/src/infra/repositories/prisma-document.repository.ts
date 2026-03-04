import { PrismaClient } from '@prisma/client'
import { Document } from '../../domain/entities/document.entity'
import { DocumentStatus } from '../../domain/enums/document-status.enum'
import {
    DocumentRepository,
    CreateDocumentData,
    CreateFileData,
    FindAllParams,
    PaginatedResult,
} from '../../domain/repositories/document.repository'
import { DocumentMapper } from '../../application/mappers/document.mapper'

export class PrismaDocumentRepository implements DocumentRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(data: CreateDocumentData): Promise<Document> {
        const record = await this.prisma.document.create({
            data: {
                titulo: data.titulo,
                descricao: data.descricao ?? null,
            },
        })

        return DocumentMapper.toDomain(record)
    }

    async findAll(params?: FindAllParams): Promise<PaginatedResult<Document>> {
        const page = params?.page ?? 1
        const limit = Math.min(params?.limit ?? 10, 50)
        const skip = (page - 1) * limit

        const where = params?.status ? { status: params.status } : {}

        const [records, total] = await Promise.all([
            this.prisma.document.findMany({
                where,
                skip,
                take: limit,
                orderBy: { criadoEm: 'desc' },
                include: { arquivos: true },
            }),
            this.prisma.document.count({ where }),
        ])

        return {
            data: records.map((r) => DocumentMapper.toDomainWithFiles(r)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    }

    async findById(id: string): Promise<Document | null> {
        const record = await this.prisma.document.findUnique({
            where: { id },
            include: { arquivos: true },
        })

        if (!record) return null

        return DocumentMapper.toDomainWithFiles(record)
    }

    async updateStatus(id: string, status: DocumentStatus): Promise<Document> {
        const record = await this.prisma.document.update({
            where: { id },
            data: { status },
            include: { arquivos: true },
        })

        return DocumentMapper.toDomainWithFiles(record)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.document.delete({
            where: { id },
        })
    }

    async addFiles(documentId: string, files: CreateFileData[]): Promise<void> {
        await this.prisma.documentFile.createMany({
            data: files.map((f) => ({
                name: f.name,
                type: f.type,
                data: f.data,
                documentId,
            })),
        })
    }

    async getFiles(documentId: string): Promise<CreateFileData[]> {
        const files = await this.prisma.documentFile.findMany({
            where: { documentId },
        })
        return files.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            data: f.data,
        }))
    }

    async deleteFile(fileId: string): Promise<void> {
        await this.prisma.documentFile.delete({
            where: { id: fileId },
        })
    }
}
