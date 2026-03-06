import { describe, it, expect, beforeEach } from 'vitest'
import { CreateDocumentUseCase } from '@application/use-cases/create-document.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'

describe('CreateDocumentUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: CreateDocumentUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new CreateDocumentUseCase(repository)
    })

    it('deve criar um documento com dados válidos', async () => {
        const result = await useCase.execute({
            titulo: 'Contrato de Serviço',
            descricao: 'Descrição do contrato',
        })

        expect(result).toMatchObject({
            titulo: 'Contrato de Serviço',
            descricao: 'Descrição do contrato',
            status: 'PENDENTE',
        })
        expect(result.id).toBeDefined()
        expect(result.criadoEm).toBeDefined()
    })

    it('deve criar um documento sem descrição', async () => {
        const result = await useCase.execute({
            titulo: 'Documento sem descrição',
        })

        expect(result.titulo).toBe('Documento sem descrição')
        expect(result.descricao).toBeNull()
        expect(result.status).toBe('PENDENTE')
    })

})
