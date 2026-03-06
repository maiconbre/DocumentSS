import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteDocumentUseCase } from '@application/use-cases/delete-document.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'
import { DocumentStatus } from '@domain/enums/document-status.enum'

describe('DeleteDocumentUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: DeleteDocumentUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new DeleteDocumentUseCase(repository)
    })

    it('deve deletar documento existente', async () => {
        const doc = await repository.create({ titulo: 'Documento para deletar' })

        await useCase.execute(doc.id)

        const found = await repository.findById(doc.id)
        expect(found).toBeNull()
    })

    it('deve lançar DocumentNotFoundError quando id não existe', async () => {
        await expect(
            useCase.execute('id-inexistente'),
        ).rejects.toThrow(DocumentNotFoundError)
    })

    it('deve bloquear a exclusão de um documento ASSINADO', async () => {
        const doc = await repository.create({ titulo: 'Documento assinado' })
        await repository.updateStatus(doc.id, DocumentStatus.ASSINADO)

        await expect(
            useCase.execute(doc.id)
        ).rejects.toThrow('Documentos com status ASSINADO não podem ser deletados')
    })
})
