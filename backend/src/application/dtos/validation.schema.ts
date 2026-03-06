import { z } from 'zod'
import { DocumentStatus } from '@domain/enums/document-status.enum'

// ==================== REQUEST/INPUT Schemas ====================

export const CreateDocumentRequestSchema = z.object({
    titulo: z
        .string()
        .min(1, 'Título é obrigatório')
        .max(255, 'Título não pode exceder 255 caracteres')
        .trim(),
    descricao: z
        .string()
        .max(2000, 'Descrição não pode exceder 2000 caracteres')
        .optional()
        .nullable(),
})

export type CreateDocumentRequest = z.infer<typeof CreateDocumentRequestSchema>

export const UpdateDocumentStatusRequestSchema = z.object({
    status: z
        .enum([DocumentStatus.PENDENTE, DocumentStatus.ASSINADO] as const)
        .refine((status) => Object.values(DocumentStatus).includes(status as DocumentStatus), {
            message: `Status inválido. Valores permitidos: ${Object.values(DocumentStatus).join(', ')}`,
        }),
})

export type UpdateDocumentStatusRequest = z.infer<
    typeof UpdateDocumentStatusRequestSchema
>

export const AddFilesRequestSchema = z.object({
    arquivos: z
        .array(
            z.object({
                name: z
                    .string()
                    .min(1, 'Nome do arquivo é obrigatório')
                    .max(255, 'Nome não pode exceder 255 caracteres'),
                type: z
                    .string()
                    .min(1, 'Tipo do arquivo é obrigatório')
                    .max(100, 'Tipo não pode exceder 100 caracteres'),
                data: z
                    .string()
                    .min(1, 'Dados do arquivo são obrigatórios')
                    .describe('Base64 encoded file data'),
            }),
        )
        .min(1, 'Pelo menos um arquivo é obrigatório')
        .max(10, 'Máximo de 10 arquivos por operação'),
})

export type AddFilesRequest = z.infer<typeof AddFilesRequestSchema>

export const ListDocumentsQuerySchema = z.object({
    page: z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: 'Página deve ser um número inteiro positivo',
        })
        .optional()
        .default(1),
    limit: z
        .union([z.string(), z.number()])
        .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
        .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
            message: 'Limite deve ser um número inteiro entre 1 e 100',
        })
        .optional()
        .default(10),
    status: z
        .enum([DocumentStatus.PENDENTE, DocumentStatus.ASSINADO] as const)
        .optional(),
})

export type ListDocumentsQuery = z.infer<typeof ListDocumentsQuerySchema>

export const DocumentIdParamSchema = z.object({
    id: z.string().uuid('ID deve ser um UUID válido'),
})

export type DocumentIdParam = z.infer<typeof DocumentIdParamSchema>

// ==================== RESPONSE/OUTPUT Schemas ====================
// Nota: Response schemas são para documentação/tipos, não para validação em runtime

export const DocumentFileResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    data: z.string(),
})

export type DocumentFileResponse = z.infer<typeof DocumentFileResponseSchema>

export const DocumentResponseSchema = z.object({
    id: z.string().uuid(),
    titulo: z.string(),
    descricao: z.string().nullable(),
    status: z.enum([DocumentStatus.PENDENTE, DocumentStatus.ASSINADO]),
    criadoEm: z.string(),
    arquivos: z.array(DocumentFileResponseSchema).optional(),
})

export type DocumentResponse = z.infer<typeof DocumentResponseSchema>

export const DocumentListResponseSchema = z.object({
    data: z.array(DocumentResponseSchema),
    meta: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
    }),
})

export type DocumentListResponse = z.infer<typeof DocumentListResponseSchema>

// ==================== DTO ALIASES (Backward Compatibility) ====================
// Mantém compatibilidade com código existente que usa nomes de DTOs

export type CreateDocumentDTO = CreateDocumentRequest
export type UpdateDocumentStatusDTO = UpdateDocumentStatusRequest
export type DocumentFileDTO = DocumentFileResponse
export type DocumentResponseDTO = DocumentResponse
