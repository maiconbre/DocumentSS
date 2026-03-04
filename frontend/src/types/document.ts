export interface DocumentFile {
    id: string
    name: string
    type: string
    data: string
}

export interface Document {
    id: string
    titulo: string
    descricao: string | null
    status: 'PENDENTE' | 'ASSINADO'
    criadoEm: string
    arquivos?: DocumentFile[]
}

export interface CreateDocumentInput {
    titulo: string
    descricao?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
