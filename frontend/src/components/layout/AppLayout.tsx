'use client'

import { ReactNode, useState } from 'react'
import { Document } from '../../types/document'
import { FileText, FolderOpen, Plus, CheckCircle2, Clock, Menu, X } from 'lucide-react'
import styles from './AppLayout.module.css'

interface LayoutProps {
    children: ReactNode
    documents: Document[]
    onNewClick?: () => void
    onDocClick?: (doc: Document) => void
}

export function AppLayout({ children, documents, onNewClick, onDocClick }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    function handleDocClick(doc: Document) {
        onDocClick?.(doc)
        setSidebarOpen(false)
    }

    return (
        <div className={styles.layout}>
            <button
                className={styles.menuToggle}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Abrir menu"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {sidebarOpen && (
                <div
                    className={`${styles.overlay} ${styles.visible}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}
                role="navigation"
                aria-label="Menu lateral"
            >
                <div className={styles.logo}>
                    <FileText size={22} className={styles.logoIcon} />
                    <span className={styles.logoText}>DocumentSS</span>
                </div>

                <div className={styles.section}>
                    <button className={styles.newBtn} onClick={onNewClick} aria-label="Criar novo documento">
                        <Plus size={16} /> Novo Documento
                    </button>
                </div>

                <div className={styles.treeSection}>
                    <div className={styles.treeHeader}>
                        <FolderOpen size={16} className={styles.folderIcon} />
                        <span className={styles.treeTitle}>Documentos</span>
                    </div>
                    <div className={styles.treeLine}></div>
                    <nav className={styles.docList} aria-label="Lista de documentos">
                        {documents.map((doc) => (
                            <button
                                key={doc.id}
                                className={styles.docItem}
                                onClick={() => handleDocClick(doc)}
                                aria-label={`${doc.titulo} - ${doc.status === 'ASSINADO' ? 'Assinado' : 'Pendente'}`}
                            >
                                <span className={styles.docIcon}>
                                    {doc.status === 'ASSINADO'
                                        ? <CheckCircle2 size={14} color="#10b981" />
                                        : <Clock size={14} color="#f59e0b" />
                                    }
                                </span>
                                <span className={styles.docName}>{doc.titulo}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className={styles.sidebarFooter}>
                    <p>v1.0.0</p>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
