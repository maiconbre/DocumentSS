import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'

export async function registerSwagger(app: FastifyInstance) {
    await app.register(swagger, {
        openapi: {
            info: {
                title: 'DocumentSS API',
                description: 'API para gerenciamento de documentos',
                version: '0.0.1',
            },
            tags: [
                { name: 'Documents', description: 'Operações de documentos' },
                { name: 'Health', description: 'Status da aplicação' },
            ],
        },
    })

    await app.register(swaggerUi, {
        routePrefix: '/docs',
    })
}
