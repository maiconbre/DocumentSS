import { DocumentStatus } from '../enums/document-status.enum'

export interface DocumentProps {
    id: string
    titulo: string
    descricao: string | null
    status: DocumentStatus
    criadoEm: Date
}

export class Document {
    readonly id: string
    readonly titulo: string
    readonly descricao: string | null
    readonly status: DocumentStatus
    readonly criadoEm: Date

    constructor(props: DocumentProps) {
        this.id = props.id
        this.titulo = props.titulo
        this.descricao = props.descricao
        this.status = props.status
        this.criadoEm = props.criadoEm
    }

    /** Retorna nova instância com status ASSINADO */
    assinar(): Document {
        return new Document({ ...this, status: DocumentStatus.ASSINADO })
    }

    isPendente(): boolean {
        return this.status === DocumentStatus.PENDENTE
    }

    isAssinado(): boolean {
        return this.status === DocumentStatus.ASSINADO
    }
}
