import { FastifyInstance, FastifyError } from 'fastify'
import { DocumentNotFoundError } from '../../../domain/errors/document-not-found.error'

export function registerErrorHandler(app: FastifyInstance) {
    app.setErrorHandler((error: Error | FastifyError, request, reply) => {
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
            })
        }

        // Erro inesperado — não expor detalhes internos
        request.log.error(error)

        return reply.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Erro interno do servidor',
        })
    })
}


