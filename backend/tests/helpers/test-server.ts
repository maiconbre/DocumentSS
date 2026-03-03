import Fastify, { FastifyInstance } from 'fastify'
import { registerErrorHandler } from '../../src/infra/http/middlewares/error-handler'
import { registerDocumentRoutes } from '../../src/infra/http/routes/document.routes'
import { FakeDocumentRepository } from './fake-document.repository'

export async function buildTestApp(): Promise<{
    app: FastifyInstance
    repository: FakeDocumentRepository
}> {
    const app = Fastify({ logger: false })
    const repository = new FakeDocumentRepository()

    registerErrorHandler(app)

    await app.register(async (instance) => {
        registerDocumentRoutes(instance, repository)
    }, { prefix: '/api' })

    await app.ready()

    return { app, repository }
}
