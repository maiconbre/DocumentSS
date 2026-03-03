import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateDocumentStatusUseCase } from '../../../src/application/use-cases/update-document-status.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentNotFoundError } from '../../../src/domain/errors/document-not-found.error'
import { DocumentStatus } from '../../../src/domain/enums/document-status.enum'

describe('UpdateDocumentStatusUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: UpdateDocumentStatusUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new UpdateDocumentStatusUseCase(repository)
    })

    it('deve atualizar status de PENDENTE para ASSINADO', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })

        const result = await useCase.execute(doc.id, { status: DocumentStatus.ASSINADO })

        expect(result.status).toBe('ASSINADO')
        expect(result.id).toBe(doc.id)
    })

    it('deve atualizar status de ASSINADO para PENDENTE', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })
        await repository.updateStatus(doc.id, DocumentStatus.ASSINADO)

        const result = await useCase.execute(doc.id, { status: DocumentStatus.PENDENTE })

        expect(result.status).toBe('PENDENTE')
    })

    it('deve lançar DocumentNotFoundError quando id não existe', async () => {
        await expect(
            useCase.execute('id-inexistente', { status: DocumentStatus.ASSINADO }),
        ).rejects.toThrow(DocumentNotFoundError)
    })
})
