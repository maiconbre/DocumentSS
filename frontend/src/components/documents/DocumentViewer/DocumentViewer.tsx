'use client'

import { Document } from '../../../types/document'
import { Modal } from '../../ui/Modal/Modal'
import { Clock, CheckCircle2, FileText, Image as ImageIcon, PenLine, Download, Trash2, Undo2 } from 'lucide-react'
import styles from './DocumentViewer.module.css'

interface DocumentViewerProps {
    doc: Document | null
    isOpen: boolean
    onClose: () => void
    onSign?: () => void
    onDelete?: () => void
}

export function DocumentViewer({ doc, isOpen, onClose, onSign, onDelete }: DocumentViewerProps) {
    if (!doc) return null

    function getFileIcon(type: string) {
        if (type === 'application/pdf') return <FileText size={16} color="#ef4444" />
        if (type.startsWith('image/')) return <ImageIcon size={16} color="#6366f1" />
        return <FileText size={16} color="#6b7280" />
    }

    function isImageType(type: string) {
        return type.startsWith('image/')
    }

    function isSignature(fileName: string) {
        return fileName.toLowerCase().includes('assinatura')
    }

    function downloadFile(file: { data: string; name: string }) {
        const link = document.createElement('a')
        link.href = file.data
        link.download = file.name
        link.click()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={doc.titulo} size="lg">
            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={`${styles.status} ${styles[doc.status.toLowerCase()]}`}>
                        {doc.status === 'PENDENTE'
                            ? <><Clock size={14} /> Pendente</>
                            : <><CheckCircle2 size={14} /> Assinado</>
                        }
                    </span>
                    <span className={styles.date}>
                        Criado em {new Date(doc.criadoEm).toLocaleDateString('pt-BR')}
                    </span>
                </div>

                {doc.descricao && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Descrição</h3>
                        <p className={styles.description}>{doc.descricao}</p>
                    </div>
                )}

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Arquivos ({doc.arquivos?.length || 0})</h3>
                    {doc.arquivos && doc.arquivos.length > 0 ? (
                        <div className={styles.files}>
                            {doc.arquivos.map((file) => (
                                <div key={file.id} className={styles.fileCard}>
                                    <div className={styles.fileHeader}>
                                        <span className={styles.fileIcon}>{getFileIcon(file.type)}</span>
                                        <span className={styles.fileName}>{file.name}</span>
                                    </div>

                                    {isImageType(file.type) ? (
                                        <div className={`${styles.imagePreview} ${isSignature(file.name) ? styles.signaturePreview : ''}`}>
                                            {isSignature(file.name) && (
                                                <span className={styles.signatureLabel}><PenLine size={12} /> Assinatura</span>
                                            )}
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={file.data} alt={file.name} />
                                        </div>
                                    ) : (
                                        <div className={styles.pdfPreview}>
                                            <FileText size={24} color="#ef4444" />
                                            <span className={styles.pdfName}>{file.name}</span>
                                        </div>
                                    )}

                                    <button
                                        className={styles.downloadBtn}
                                        onClick={() => downloadFile(file)}
                                    >
                                        <Download size={14} /> Baixar arquivo
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noFiles}>Nenhum arquivo anexado.</p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.deleteBtn}
                        onClick={onDelete}
                    >
                        <Trash2 size={14} /> Excluir
                    </button>
                    <button
                        className={styles.signBtn}
                        onClick={onSign}
                    >
                        {doc.status === 'PENDENTE'
                            ? <><PenLine size={14} /> Assinar</>
                            : <><Undo2 size={14} /> Desfazer</>
                        }
                    </button>
                </div>
            </div>
        </Modal>
    )
}
