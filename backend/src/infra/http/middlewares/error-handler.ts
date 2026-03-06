import { FastifyInstance, FastifyError } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'
import { DocumentNotFoundError } from '@domain/errors/document-not-found.error'
import {
    InvalidDocumentStatusError,
    MissingParamError,
} from '@domain/errors/validation.error'

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: Error | FastifyError, request, reply) => {
        // Erro de validação Zod via Provider Nativo Fastify
        if (hasZodFastifySchemaValidationErrors(error)) {
            return reply.status(400).send({
                statusCode: 400,
                error: 'Validation Failed',
                message: 'Parâmetros inválidos ou tipos incorretos',
                issues: error.validation.map(v => ({
                    path: v.instancePath,
                    message: v.message,
                    code: v.params?.issueCode || 'invalid_type'
                })),
            })
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

        // Erro de regra de negócio
        if (error.name === 'DocumentCannotBeDeletedError') {
            return reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
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
