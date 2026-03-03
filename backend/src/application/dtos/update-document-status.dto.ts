import { DocumentStatus } from '../../domain/enums/document-status.enum'

export interface UpdateDocumentStatusDTO {
    status: DocumentStatus
}
