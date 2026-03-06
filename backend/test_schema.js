const { jsonSchemaTransform } = require('fastify-type-provider-zod');
const { CreateDocumentRequestSchema, DocumentResponseSchema, DocumentListResponseSchema, AddFilesRequestSchema } = require('./src/application/dtos/validation.schema');

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
    } catch (err) {
        console.error(`${name}: FAILED =>`, err.message);
    }
}
