import { FastifyInstance, FastifyError } from 'fastify'
import { DocumentNotFoundError } from '../../../domain/errors/document-not-found.error'
import {
    ValidationError,
    InvalidDocumentStatusError,
    MissingParamError,
} from '../../../domain/errors/validation.error'

interface ErrorResponse {
    statusCode: number
    error: string
    message: string
    issues?: Array<{
        path: (string | number)[]
        message: string
        code: string
    }>
}

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: Error | FastifyError, request, reply) => {
        // Erro de validação Zod
        if (error instanceof ValidationError) {
            const response: ErrorResponse = {
                statusCode: 400,
                error: 'Validation Failed',
                message: error.getFormattedMessage(),
                issues: error.issues,
            }
            return reply.status(400).send(response)
        }

        // Erro de status inválido
        if (error instanceof InvalidDocumentStatusError) {
            return reply.status(error.statusCode).send({
                statusCode: error.statusCode,
                error: 'Invalid Status',
                message: error.message,
            })
        }

        // Erro de parâmetro ausente
        if (error instanceof MissingParamError) {
            return reply.status(error.statusCode).send({
                statusCode: error.statusCode,
                error: 'Missing Parameter',
                message: error.message,
            })
        }

        // Erro de domínio — documento não encontrado
        if (error instanceof DocumentNotFoundError || error.name === 'DocumentNotFoundError') {
            return reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: error.message,
            })
        }

        // Erro de validação do Fastify (JSON Schema)
        const fastifyError = error as FastifyError
        if (fastifyError.validation) {
            return reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: fastifyError.message,
                issues: fastifyError.validation,
            })
        }

        // Erro inesperado — não expor detalhes internos, apenas logar
        request.log.error({
            err: error,
            message: error.message,
            name: error.name,
            stack: error.stack,
        })

        return reply.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Um erro interno ocorreu no servidor',
        })
    })
}
