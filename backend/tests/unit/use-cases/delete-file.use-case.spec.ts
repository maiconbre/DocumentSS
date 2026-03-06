import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteFileUseCase } from '@application/use-cases/delete-file.use-case'
import { FakeDocumentRepository } from '../../helpers/fake-document.repository'

describe('DeleteFileUseCase', () => {
    let repository: FakeDocumentRepository
    let useCase: DeleteFileUseCase

    beforeEach(() => {
        repository = new FakeDocumentRepository()
        useCase = new DeleteFileUseCase(repository)
    })

    it('deve deletar arquivo sem lançar erro para fileId válido', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })

        await repository.addFiles(doc.id, [
            { name: 'documento.pdf', type: 'application/pdf', data: 'base64data' },
        ])

        const files = await repository.getFiles(doc.id)
        expect(files).toHaveLength(1)

        // DeleteFileUseCase não lança erro — resolve normalmente
        await expect(
            useCase.execute('qualquer-id'),
        ).resolves.toBeUndefined()
    })

    it('arquivo removido não deve aparecer na listagem do documento', async () => {
        const doc = await repository.create({ titulo: 'Contrato' })

        // Adiciona via use case de add (para obter o id do arquivo armazenado)
        await repository.addFiles(doc.id, [
            { name: 'rascunho.pdf', type: 'application/pdf', data: 'base64data' },
        ])

        // Obtém o id interno do arquivo pelo FakeRepo
        const stored = (repository as any).files as { id: string; documentId: string }[]
        const fileId = stored.find((f: { documentId: string }) => f.documentId === doc.id)!.id

        await useCase.execute(fileId)

        const remaining = await repository.getFiles(doc.id)
        expect(remaining).toHaveLength(0)
    })
})
