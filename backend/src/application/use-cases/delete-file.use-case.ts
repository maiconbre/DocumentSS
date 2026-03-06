import { DocumentRepository } from '@domain/repositories/document.repository'

export class DeleteFileUseCase {
    constructor(private readonly repository: DocumentRepository) { }

    async execute(fileId: string): Promise<void> {
        await this.repository.deleteFile(fileId)
    }
}
