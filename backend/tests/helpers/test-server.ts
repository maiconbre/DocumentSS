import Fastify, { FastifyInstance } from 'fastify'
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod'
import { registerErrorHandler } from '@infra/http/middlewares/error-handler'
import { registerDocumentRoutes } from '@infra/http/routes/document.routes'
import { FakeDocumentRepository } from './fake-document.repository'

export async function buildTestApp(): Promise<{
    app: FastifyInstance
    repository: FakeDocumentRepository
}> {
    const app = Fastify({ logger: false })

    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    const repository = new FakeDocumentRepository()

    registerErrorHandler(app)

    await app.register(async (instance) => {
        registerDocumentRoutes(instance, repository)
    }, { prefix: '/api' })

    await app.ready()

    return { app, repository }
}
