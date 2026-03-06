import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { CreateDocumentRequestSchema, DocumentResponseSchema, DocumentListResponseSchema, AddFilesRequestSchema } from './src/application/dtos/validation.schema';

const testCases = {
    CreateDocumentRequestSchema,
    DocumentResponseSchema,
    DocumentListResponseSchema,
    AddFilesRequestSchema,
};

// Obter o tipo do primeiro argumento da função jsonSchemaTransform
type TransformInput = Parameters<typeof jsonSchemaTransform>[0];

for (const [name, schema] of Object.entries(testCases)) {
    try {
        const input = {
            schema: { body: schema, response: { 200: schema } },
            url: '/test',
            route: {} as import('fastify').RouteOptions,
            openapiObject: { openapi: '3.0.0' },
        } as TransformInput;

        const result = jsonSchemaTransform(input);
        console.log(`${name}: OK`);
    } catch (err: any) {
        console.error(`${name}: FAILED =>`, err.message);
    }
}
