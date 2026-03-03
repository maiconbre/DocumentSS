'use client'

import { Document } from '../types/document'
import { StatusBadge } from './status-badge'
import styles from './document-list.module.css'

interface DocumentListProps {
    documents: Document[]
    onToggleStatus: (id: string, currentStatus: 'PENDENTE' | 'ASSINADO') => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function DocumentList({ documents, onToggleStatus, onDelete }: DocumentListProps) {
    if (documents.length === 0) {
        return (
            <div className={styles.empty}>
                <p>Nenhum documento encontrado.</p>
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
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id}>
                            <td className={styles.titleCell}>{doc.titulo}</td>
                            <td className={styles.descCell}>{doc.descricao || '—'}</td>
                            <td>
                                <StatusBadge status={doc.status} />
                            </td>
                            <td className={styles.dateCell}>{formatDate(doc.criadoEm)}</td>
                            <td className={styles.actions}>
                                <button
                                    className={styles.btnStatus}
                                    onClick={() => onToggleStatus(doc.id, doc.status)}
                                    title={doc.status === 'PENDENTE' ? 'Marcar como assinado' : 'Voltar para pendente'}
                                >
                                    {doc.status === 'PENDENTE' ? '✍️ Assinar' : '↩️ Pendente'}
                                </button>
                                <button
                                    className={styles.btnDelete}
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja excluir este documento?')) {
                                            onDelete(doc.id)
                                        }
                                    }}
                                >
                                    🗑️ Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
