import { DocumentRepository, FindAllParams } from '../../domain/repositories/document.repository'
import { DocumentResponseDTO } from '../dtos/validation.schema'
import { DocumentMapper } from '../mappers/document.mapper'

export interface ListDocumentsResult {
    data: DocumentResponseDTO[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export class ListDocumentsUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(params?: FindAllParams): Promise<ListDocumentsResult> {
        const result = await this.repository.findAll(params)

        return {
            data: result.data.map(DocumentMapper.toResponse),
            meta: result.meta,
        }
    }
}
