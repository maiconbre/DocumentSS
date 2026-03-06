import { describe, it, expect, beforeEach } from 'vitest'
import { AddFilesUseCase } from '@application/use-cases/add-files.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'

describe('AddFilesUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: AddFilesUseCase

    const mockArquivo = {
        name: 'contrato.pdf',
        type: 'application/pdf',
        data: 'data:application/pdf;base64,JVBERi0xLjQ=',
    }

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new AddFilesUseCase(repository)
    })

    it('deve adicionar arquivos e retornar documento atualizado com arquivos', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })

        const result = await useCase.execute(doc.id, [mockArquivo])

        expect(result.id).toBe(doc.id)
        expect(result.arquivos).toHaveLength(1)
        expect(result.arquivos![0].name).toBe('contrato.pdf')
        expect(result.arquivos![0].type).toBe('application/pdf')
    })

    it('deve lançar DocumentNotFoundError quando documento não existe', async () => {
        await expect(
            useCase.execute('id-inexistente', [mockArquivo]),
        ).rejects.toThrow(DocumentNotFoundError)
    })
})
