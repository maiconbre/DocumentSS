export class DocumentNotFoundError extends Error {
    constructor(id: string) {
        super(`Documento com id "${id}" não encontrado`)
        this.name = 'DocumentNotFoundError'
    }
}
