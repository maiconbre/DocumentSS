export interface DocumentFileDTO {
    id: string
    name: string
    type: string
    data: string
}

export interface DocumentResponseDTO {
    id: string
    titulo: string
    descricao: string | null
    status: string
    criadoEm: string
    arquivos?: DocumentFileDTO[]
}
