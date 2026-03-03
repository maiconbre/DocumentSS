import { describe, it, expect, beforeEach } from 'vitest'
import { GetDocumentUseCase } from '../../../src/application/use-cases/get-document.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentNotFoundError } from '../../../src/domain/errors/document-not-found.error'

describe('GetDocumentUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: GetDocumentUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new GetDocumentUseCase(repository)
    })

    it('deve retornar documento existente por id', async () => {
        const doc = await repository.create({
            titulo: 'Contrato',
            descricao: 'Descrição do contrato',
        })

        const result = await useCase.execute(doc.id)

        expect(result.id).toBe(doc.id)
        expect(result.titulo).toBe('Contrato')
        expect(result.descricao).toBe('Descrição do contrato')
        expect(result.status).toBe('PENDENTE')
    })

    it('deve lançar DocumentNotFoundError quando id não existe', async () => {
        await expect(
            useCase.execute('id-inexistente'),
        ).rejects.toThrow(DocumentNotFoundError)
    })

    it('deve retornar criadoEm em formato ISO 8601', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })
        const result = await useCase.execute(doc.id)

        expect(result.criadoEm).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
})
