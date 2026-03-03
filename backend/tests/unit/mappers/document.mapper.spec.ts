import { describe, it, expect } from 'vitest'
import { DocumentMapper } from '../../../src/application/mappers/document.mapper'
import { Document } from '../../../src/domain/entities/document.entity'
import { DocumentStatus } from '../../../src/domain/enums/document-status.enum'

describe('DocumentMapper', () => {
    const sampleDate = new Date('2026-03-03T20:00:00.000Z')

    const sampleEntity = new Document({
        id: '550e8400-e29b-41d4-a716-446655440000',
        titulo: 'Contrato',
        descricao: 'Descrição do contrato',
        status: DocumentStatus.PENDENTE,
        criadoEm: sampleDate,
    })

    describe('toResponse', () => {
        it('deve converter Entity para DocumentResponseDTO', () => {
            const dto = DocumentMapper.toResponse(sampleEntity)

            expect(dto).toEqual({
                id: '550e8400-e29b-41d4-a716-446655440000',
                titulo: 'Contrato',
                descricao: 'Descrição do contrato',
                status: 'PENDENTE',
                criadoEm: '2026-03-03T20:00:00.000Z',
            })
        })

        it('deve manter descricao null quando Entity tem descricao null', () => {
            const entityWithoutDesc = new Document({
                ...sampleEntity,
                descricao: null,
            })

            const dto = DocumentMapper.toResponse(entityWithoutDesc)

            expect(dto.descricao).toBeNull()
        })
    })

    describe('toDomain', () => {
        it('deve converter registro raw para Entity', () => {
            const raw = {
                id: '550e8400-e29b-41d4-a716-446655440000',
                titulo: 'Contrato',
                descricao: 'Descrição',
                status: DocumentStatus.ASSINADO,
                criadoEm: sampleDate,
            }

            const entity = DocumentMapper.toDomain(raw)

            expect(entity).toBeInstanceOf(Document)
            expect(entity.id).toBe(raw.id)
            expect(entity.titulo).toBe(raw.titulo)
            expect(entity.status).toBe(DocumentStatus.ASSINADO)
            expect(entity.criadoEm).toEqual(sampleDate)
        })
    })
})
