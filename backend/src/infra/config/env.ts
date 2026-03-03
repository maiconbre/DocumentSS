interface EnvConfig {
    PORT: number
    DATABASE_URL: string
    NODE_ENV: string
    CORS_ORIGIN: string
}

function getEnvOrThrow(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(`❌ Variável de ambiente obrigatória não definida: ${key}`)
    }
    return value
}

export function loadEnv(): EnvConfig {
    return {
        PORT: Number(process.env.PORT) || 3333,
        DATABASE_URL: getEnvOrThrow('DATABASE_URL'),
        NODE_ENV: process.env.NODE_ENV || 'development',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    }
}
