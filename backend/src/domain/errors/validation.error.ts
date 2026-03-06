import { ZodError } from 'zod'

export interface ValidationIssue {
    path: (string | number)[]
    message: string
    code: string
}

export class ValidationError extends Error {
    readonly statusCode = 400
    readonly issues: ValidationIssue[]

    constructor(zodError: ZodError | ValidationIssue[]) {
        super('Validation error')
        this.name = 'ValidationError'

        if (zodError instanceof ZodError) {
            this.issues = zodError.issues.map((issue) => ({
                path: issue.path.filter((p): p is string | number => typeof p !== 'symbol'),
                message: issue.message,
                code: issue.code,
            }))
        } else {
            this.issues = zodError
        }
    }

    getFormattedMessage(): string {
        const lines = this.issues.map(
            (issue) => `${issue.path.join('.')}: ${issue.message}`,
        )
        return lines.join('\n')
    }
}

export class InvalidDocumentStatusError extends Error {
    readonly statusCode = 400

    constructor(status: string) {
        super(`Status inválido: "${status}". Valores permitidos: PENDENTE, ASSINADO`)
        this.name = 'InvalidDocumentStatusError'
    }
}

export class MissingParamError extends Error {
    readonly statusCode = 400

    constructor(param: string) {
        super(`Parâmetro obrigatório ausente: ${param}`)
        this.name = 'MissingParamError'
    }
}
