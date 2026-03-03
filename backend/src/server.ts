import { buildApp } from './app'
import { loadEnv } from './infra/config/env'
import { prisma } from './infra/database/prisma-client'

async function start() {
    const env = loadEnv()
    const app = await buildApp()

    try {
        await app.listen({ port: env.PORT, host: '0.0.0.0' })
        console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`)
        console.log(`📚 Documentação em http://localhost:${env.PORT}/docs`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }

    // Graceful Shutdown
    const shutdown = async (signal: string) => {
        console.log(`\n🛑 ${signal} recebido. Encerrando...`)
        await app.close()
        await prisma.$disconnect()
        console.log('✅ Servidor encerrado com sucesso')
        process.exit(0)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
}

start()
