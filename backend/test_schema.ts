import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import { CreateDocumentRequestSchema, DocumentResponseSchema, DocumentListResponseSchema, AddFilesRequestSchema } from './src/application/dtos/validation.schema';

const testCases = {
    CreateDocumentRequestSchema,
    DocumentResponseSchema,
    DocumentListResponseSchema,
    AddFilesRequestSchema,
};

for (const [name, schema] of Object.entries(testCases)) {
    try {
        const result = jsonSchemaTransform({ schema: { body: schema, response: { 200: schema } } });
        console.log(`${name}: OK`);
    } catch (err: any) {
        console.error(`${name}: FAILED =>`, err.message);
    }
}
