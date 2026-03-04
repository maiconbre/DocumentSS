export const createDocumentSchema = {
    tags: ['Documents'],
    summary: 'Criar documento',
    description: 'Cria um novo documento com status PENDENTE',
    body: {
        type: 'object',
        required: ['titulo'],
        properties: {
            titulo: { type: 'string', minLength: 1, maxLength: 255 },
            descricao: { type: 'string', maxLength: 2000 },
        },
        additionalProperties: false,
    },
    response: {
        201: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                titulo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
                criadoEm: { type: 'string', format: 'date-time' },
            },
        },
    },
}

export const getDocumentSchema = {
    tags: ['Documents'],
    summary: 'Buscar documento por ID',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                titulo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
                criadoEm: { type: 'string', format: 'date-time' },
            },
        },
    },
}

export const updateDocumentStatusSchema = {
    tags: ['Documents'],
    summary: 'Atualizar status do documento',
    description: 'Atualiza o status de um documento (PENDENTE ↔ ASSINADO)',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
    body: {
        type: 'object',
        required: ['status'],
        properties: {
            status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                titulo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
                criadoEm: { type: 'string', format: 'date-time' },
            },
        },
    },
}

export const deleteDocumentSchema = {
    tags: ['Documents'],
    summary: 'Deletar documento',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
}

export const listDocumentsSchema = {
    tags: ['Documents'],
    summary: 'Listar documentos',
    description: 'Lista documentos com paginação e filtro por status',
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
            status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
        },
        additionalProperties: false,
    },
}

export const addFilesSchema = {
    tags: ['Files'],
    summary: 'Adicionar arquivos ao documento',
    description: 'Adiciona um ou mais arquivos (Base64) a um documento existente',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
    body: {
        type: 'object',
        required: ['arquivos'],
        properties: {
            arquivos: {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    required: ['name', 'type', 'data'],
                    properties: {
                        name: { type: 'string', minLength: 1 },
                        type: { type: 'string', minLength: 1 },
                        data: { type: 'string', minLength: 1 },
                    },
                    additionalProperties: false,
                },
            },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                titulo: { type: 'string' },
                descricao: { type: 'string', nullable: true },
                status: { type: 'string', enum: ['PENDENTE', 'ASSINADO'] },
                criadoEm: { type: 'string', format: 'date-time' },
                arquivos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            type: { type: 'string' },
                            data: { type: 'string' },
                        },
                    },
                },
            },
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
}

export const getFilesSchema = {
    tags: ['Files'],
    summary: 'Listar arquivos do documento',
    description: 'Retorna todos os arquivos vinculados a um documento',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'string', format: 'uuid' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    data: { type: 'string' },
                },
            },
        },
        404: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer' },
                error: { type: 'string' },
                message: { type: 'string' },
            },
        },
    },
}

export const deleteFileSchema = {
    tags: ['Files'],
    summary: 'Deletar arquivo',
    description: 'Remove um arquivo específico de um documento',
    params: {
        type: 'object',
        required: ['documentId', 'fileId'],
        properties: {
            documentId: { type: 'string', format: 'uuid' },
            fileId: { type: 'string', format: 'uuid' },
        },
    },
    response: {
        204: {
            type: 'null',
            description: 'Arquivo removido com sucesso',
        },
    },
}

