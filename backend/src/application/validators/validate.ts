import { ZodSchema } from 'zod'
import { ValidationError } from '@domain/errors/validation.error'

/**
 * Valida dados contra um schema Zod e lança erro estruturado se inválido
 * @param schema - Schema Zod para validação
 * @param data - Dados a validar
 * @returns Dados validados e tipados
 * @throws ValidationError se validação falhar
 */
export function validateOrThrow<T>(schema: ZodSchema, data: unknown): T {
    try {
        return schema.parse(data) as T
    } catch (error) {
        throw new ValidationError(error as any)
    }
}

/**
 * Valida dados contra um schema Zod e retorna resultado com erro ou dados
 * Útil para situações onde você prefere lidar com erro sem exception
 * @param schema - Schema Zod para validação
 * @param data - Dados a validar
 * @returns { success: true, data } ou { success: false, error }
 */
export function validateOrFail<T>(
    schema: ZodSchema,
    data: unknown,
): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
        const validated = schema.parse(data)
        return { success: true, data: validated as T }
    } catch (error) {
        return { success: false, error: new ValidationError(error as any) }
    }
}
