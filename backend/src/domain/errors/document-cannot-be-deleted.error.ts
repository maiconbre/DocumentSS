export class DocumentCannotBeDeletedError extends Error {
    constructor() {
        super('Documentos com status ASSINADO não podem ser deletados')
        this.name = 'DocumentCannotBeDeletedError'
    }
}
