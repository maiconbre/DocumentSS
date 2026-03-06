import { describe, it, expect } from 'vitest'
import {
    CreateDocumentRequestSchema,
    UpdateDocumentStatusRequestSchema,
    AddFilesRequestSchema,
    ListDocumentsQuerySchema,
    DocumentIdParamSchema,
} from '../../../src/application/dtos/validation.schema'
import { ValidationError } from '../../../src/domain/errors/validation.error'
import { DocumentStatus } from '../../../src/domain/enums/document-status.enum'

describe('Validation Schemas', () => {
    describe('CreateDocumentRequestSchema', () => {
        it('deve validar dados válidos', () => {
            const validData = {
                titulo: 'Contrato de Serviço',
                descricao: 'Descrição do contrato',
            }

            const result = CreateDocumentRequestSchema.parse(validData)
            expect(result).toEqual(validData)
        })

        it('deve aceitar descricao nula ou ausente', () => {
            const withNull = CreateDocumentRequestSchema.parse({
                titulo: 'Documento',
                descricao: null,
            })
            expect(withNull.descricao).toBeNull()

            const withoutField = CreateDocumentRequestSchema.parse({
                titulo: 'Documento',
            })
            expect(withoutField.descricao).toBeUndefined()
        })

        it('deve fazer trim do titulo', () => {
            const result = CreateDocumentRequestSchema.parse({
                titulo: '  Documento com espaços  ',
            })
            expect(result.titulo).toBe('Documento com espaços')
        })

        it('deve rejeitar titulo vazio ou null', () => {
            expect(() => CreateDocumentRequestSchema.parse({ titulo: '' })).toThrow()
            expect(() => CreateDocumentRequestSchema.parse({ titulo: null })).toThrow()
        })

        it('deve rejeitar titulo muito longo (>255) ou tipo inválido', () => {
            expect(() =>
                CreateDocumentRequestSchema.parse({ titulo: 'a'.repeat(256) })
            ).toThrow()
            expect(() => CreateDocumentRequestSchema.parse({ titulo: 123 })).toThrow()
        })

        it('deve rejeitar descricao muito longa (>2000)', () => {
            expect(() =>
                CreateDocumentRequestSchema.parse({
                    titulo: 'Válido',
                    descricao: 'a'.repeat(2001),
                })
            ).toThrow()
        })
    })

    describe('UpdateDocumentStatusRequestSchema', () => {
        it('deve validar ambos status (PENDENTE e ASSINADO)', () => {
            const pendente = UpdateDocumentStatusRequestSchema.parse({
                status: DocumentStatus.PENDENTE,
            })
            expect(pendente.status).toBe(DocumentStatus.PENDENTE)

            const assinado = UpdateDocumentStatusRequestSchema.parse({
                status: DocumentStatus.ASSINADO,
            })
            expect(assinado.status).toBe(DocumentStatus.ASSINADO)
        })

        it('deve rejeitar status inválido ou null', () => {
            expect(() =>
                UpdateDocumentStatusRequestSchema.parse({ status: 'INVALIDO' })
            ).toThrow()
            expect(() =>
                UpdateDocumentStatusRequestSchema.parse({ status: null })
            ).toThrow()
        })
    })

    describe('DocumentIdParamSchema', () => {
        it('deve validar UUID válido', () => {
            const result = DocumentIdParamSchema.parse({
                id: '550e8400-e29b-41d4-a716-446655440000',
            })
            expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000')
        })

        it('deve rejeitar UUID inválido ou null', () => {
            expect(() =>
                DocumentIdParamSchema.parse({ id: 'nao-uuid' })
            ).toThrow()
            expect(() =>
                DocumentIdParamSchema.parse({ id: null })
            ).toThrow()
        })
    })

    describe('AddFilesRequestSchema', () => {
        it('deve validar arquivo válido', () => {
            const validData = {
                arquivos: [
                    {
                        name: 'documento.pdf',
                        type: 'application/pdf',
                        data: Buffer.from('PDF_DATA').toString('base64'),
                    },
                ],
            }

            const result = AddFilesRequestSchema.parse(validData)
            expect(result.arquivos).toHaveLength(1)
            expect(result.arquivos[0].name).toBe('documento.pdf')
        })

        it('deve validar múltiplos arquivos', () => {
            const validData = {
                arquivos: [
                    {
                        name: 'doc1.pdf',
                        type: 'application/pdf',
                        data: Buffer.from('DATA1').toString('base64'),
                    },
                    {
                        name: 'doc2.pdf',
                        type: 'application/pdf',
                        data: Buffer.from('DATA2').toString('base64'),
                    },
                ],
            }

            const result = AddFilesRequestSchema.parse(validData)
            expect(result.arquivos).toHaveLength(2)
        })

        it('deve aceitar data em base64', () => {
            const validData = {
                arquivos: [
                    {
                        name: 'documento.pdf',
                        type: 'application/pdf',
                        data: Buffer.from('PDF_DATA').toString('base64'),
                    },
                ],
            }

            const result = AddFilesRequestSchema.parse(validData)
            expect(result.arquivos[0].data).toBeDefined()
        })

        it('deve rejeitar array vazio', () => {
            const invalidData = {
                arquivos: [],
            }

            expect(() => AddFilesRequestSchema.parse(invalidData)).toThrow()
        })

        it('deve rejeitar mais de 10 arquivos', () => {
            const invalidData = {
                arquivos: Array.from({ length: 11 }, (_, i) => ({
                    name: `doc${i}.pdf`,
                    type: 'application/pdf',
                    data: Buffer.from(`DATA${i}`).toString('base64'),
                })),
            }

            expect(() => AddFilesRequestSchema.parse(invalidData)).toThrow()
        })

        it('deve rejeitar arquivo sem name', () => {
            const invalidData = {
                arquivos: [
                    {
                        type: 'application/pdf',
                        data: Buffer.from('DATA').toString('base64'),
                    },
                ],
            }

            expect(() => AddFilesRequestSchema.parse(invalidData)).toThrow()
        })
    })

    describe('ListDocumentsQuerySchema', () => {
        it('deve validar query padrão e com conversão', () => {
            const defaults = ListDocumentsQuerySchema.parse({})
            expect(defaults.page).toBe(1)
            expect(defaults.limit).toBe(10)

            const withStrings = ListDocumentsQuerySchema.parse({
                page: '2',
                limit: '20',
            })
            expect(withStrings.page).toBe(2)
            expect(withStrings.limit).toBe(20)
        })

        it('deve rejeitar page <= 0 ou limit > 100', () => {
            expect(() => ListDocumentsQuerySchema.parse({ page: 0 })).toThrow()
            expect(() => ListDocumentsQuerySchema.parse({ limit: 101 })).toThrow()
        })

        it('deve validar ambos status (PENDENTE e ASSINADO)', () => {
            const pendente = ListDocumentsQuerySchema.parse({
                status: DocumentStatus.PENDENTE,
            })
            expect(pendente.status).toBe(DocumentStatus.PENDENTE)

            const assinado = ListDocumentsQuerySchema.parse({
                status: DocumentStatus.ASSINADO,
            })
            expect(assinado.status).toBe(DocumentStatus.ASSINADO)
        })

        it('deve rejeitar status inválido', () => {
            expect(() =>
                ListDocumentsQuerySchema.parse({ status: 'INVALIDO' })
            ).toThrow()
        })
    })
})
