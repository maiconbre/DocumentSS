'use client'

import { Document } from '../../../types/document'
import { StatusBadge } from '../../ui/StatusBadge/StatusBadge'
import { FileText, Paperclip, Eye, PenLine, Undo2, Trash2 } from 'lucide-react'
import styles from './DocumentList.module.css'

interface DocumentListProps {
    documents: Document[]
    onToggleStatus: (id: string, currentStatus: 'PENDENTE' | 'ASSINADO') => void
    onDelete: (doc: Document) => void
    onView: (doc: Document) => void
}

export function DocumentList({ documents, onToggleStatus, onDelete, onView }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <div className={styles.empty}>
                <FileText size={40} color="#d1d5db" />
                <p>Nenhum documento encontrado.</p>
                <span className={styles.emptyHint}>Crie um novo documento para começar</span>
            </div>
        )
    }

    function formatDate(iso: string) {
        return new Date(iso).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className={styles.list}>
            {documents.map((doc) => (
                <div key={doc.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitle}>
                            <h3 className={styles.title}>{doc.titulo}</h3>
                            <StatusBadge status={doc.status} />
                        </div>
                        <span className={styles.date}>{formatDate(doc.criadoEm)}</span>
                    </div>

                    {doc.descricao && (
                        <p className={styles.description}>{doc.descricao}</p>
                    )}

                    {doc.arquivos && doc.arquivos.length > 0 && (
                        <div className={styles.files}>
                            <span className={styles.filesLabel}>
                                <Paperclip size={13} /> {doc.arquivos.length} arquivo{doc.arquivos.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button
                            className={styles.btnView}
                            onClick={() => onView(doc)}
                        >
                            <Eye size={14} style={{ position: 'relative', top: 2 }} /> Visualizar
                        </button>
                        <button
                            className={styles.btnSign}
                            onClick={() => onToggleStatus(doc.id, doc.status)}
                        >
                            {doc.status === 'PENDENTE'
                                ? <><PenLine size={14} /> Assinar</>
                                : <><Undo2 size={14} /> Desfazer</>
                            }
                        </button>
                        <button
                            className={styles.btnDelete}
                            onClick={() => onDelete(doc)}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
