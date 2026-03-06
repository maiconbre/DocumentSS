import { describe, it, expect, beforeEach } from 'vitest'
import { GetFilesUseCase } from '@application/use-cases/get-files.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'

describe('GetFilesUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: GetFilesUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new GetFilesUseCase(repository)
    })

    it('deve retornar lista de arquivos do documento', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })

        await repository.addFiles(doc.id, [
            { name: 'anexo1.pdf', type: 'application/pdf', data: 'base64data1' },
            { name: 'foto.png', type: 'image/png', data: 'base64data2' },
        ])

        const result = await useCase.execute(doc.id)

        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('anexo1.pdf')
        expect(result[1].name).toBe('foto.png')
    })

    it('deve lançar DocumentNotFoundError quando documento não existe', async () => {
        await expect(
            useCase.execute('id-inexistente'),
        ).rejects.toThrow(DocumentNotFoundError)
    })
})
