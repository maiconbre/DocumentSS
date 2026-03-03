import { DocumentRepository } from '../../domain/repositories/document.repository'
import { CreateDocumentDTO } from '../dtos/create-document.dto'
import { DocumentResponseDTO } from '../dtos/document-response.dto'
import { DocumentMapper } from '../mappers/document.mapper'

export class CreateDocumentUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(dto: CreateDocumentDTO): Promise<DocumentResponseDTO> {
        const document = await this.repository.create({
            titulo: dto.titulo,
            descricao: dto.descricao,
        })

        return DocumentMapper.toResponse(document)
    }
}
