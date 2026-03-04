import Fastify, { FastifyInstance } from 'fastify'
import { registerCors } from './infra/http/plugins/cors.plugin'
import { registerSwagger } from './infra/http/plugins/swagger.plugin'
import { registerErrorHandler } from './infra/http/middlewares/error-handler'
import { documentRoutes } from './infra/http/routes/document.routes'

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: true,
        bodyLimit: 50 * 1024 * 1024,
    })

    // Plugins
    await registerCors(app)
    await registerSwagger(app)

    // Error Handler Global
    registerErrorHandler(app)

    // Health Check
    app.get('/health', { schema: { tags: ['Health'] } }, async () => ({
        status: 'ok',
        timestamp: new Date().toISOString(),
    }))

    // Rotas
    await app.register(documentRoutes, { prefix: '/api' })

    return app
}
