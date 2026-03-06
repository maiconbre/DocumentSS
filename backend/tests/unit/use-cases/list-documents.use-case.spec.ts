import { describe, it, expect, beforeEach } from 'vitest'
import { ListDocumentsUseCase } from '@application/use-cases/list-documents.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'
import { DocumentStatus } from '@domain/enums/document-status.enum'

describe('ListDocumentsUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: ListDocumentsUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new ListDocumentsUseCase(repository)
    })

    it('deve retornar lista vazia quando não há documentos', async () => {
        const result = await useCase.execute()

        expect(result.data).toHaveLength(0)
        expect(result.meta.total).toBe(0)
    })

    it('deve retornar todos os documentos existentes', async () => {
        await repository.create({ titulo: 'Doc 1' })
        await repository.create({ titulo: 'Doc 2' })
        await repository.create({ titulo: 'Doc 3' })

        const result = await useCase.execute()

        expect(result.data).toHaveLength(3)
        expect(result.meta.total).toBe(3)
    })

    it('deve respeitar paginação', async () => {
        await repository.create({ titulo: 'Doc 1' })
        await repository.create({ titulo: 'Doc 2' })
        await repository.create({ titulo: 'Doc 3' })

        const result = await useCase.execute({ page: 1, limit: 2 })

        expect(result.data).toHaveLength(2)
        expect(result.meta.total).toBe(3)
        expect(result.meta.totalPages).toBe(2)
    })

    it('deve filtrar por status', async () => {
        await repository.create({ titulo: 'Doc Pendente' })
        const doc = await repository.create({ titulo: 'Doc Assinado' })
        await repository.updateStatus(doc.id, DocumentStatus.ASSINADO)

        const result = await useCase.execute({ status: DocumentStatus.ASSINADO })

        expect(result.data).toHaveLength(1)
        expect(result.data[0].titulo).toBe('Doc Assinado')
    })

})
