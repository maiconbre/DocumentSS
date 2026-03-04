'use client'

import { useState } from 'react'
import { DocumentFile } from '../types/document'
import { useDocuments } from '../hooks/useDocuments'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { AppLayout } from '../components/layout'
import { DocumentForm, DocumentList, DocumentViewer, FileUpload, SignatureModal } from '../components/documents'
import { Modal, ConfirmModal, ToastContainer } from '../components/ui'
import { Loader2 } from 'lucide-react'
import { Document } from '../types/document'
import styles from './page.module.css'

export default function Home() {
    const { documents, loading, error, isSubmitting, currentPage, totalPages, goToPage, createDocument, signDocument, deleteDocument, undoSignature } = useDocuments()
    const toast = useToast()

    const [view, setView] = useState<'list' | 'create'>('list')
    const [newFiles, setNewFiles] = useState<DocumentFile[]>([])

    const viewerModal = useModal<Document>()
    const signatureModal = useModal<Document>()
    const deleteModal = useModal<Document>()
    const undoModal = useModal<Document>()
    const createModal = useModal()

    function openCreateForm() {
        setView('create')
        createModal.open()
    }

    function closeCreateForm() {
        createModal.close()
        setView('list')
        setNewFiles([])
    }

    async function handleCreate(data: { titulo: string; descricao?: string }) {
        const success = await createDocument(data, newFiles)
        if (success) {
            closeCreateForm()
            toast.show('Documento criado com sucesso!', 'success')
        } else {
            toast.show('Erro ao criar documento', 'error')
        }
    }

    function handleToggleStatus(id: string, currentStatus: 'PENDENTE' | 'ASSINADO') {
        const doc = documents.find((d) => d.id === id)
        if (!doc) return
        if (currentStatus === 'PENDENTE') {
            signatureModal.open(doc)
        } else {
            undoModal.open(doc)
        }
    }

    async function handleSignatureConfirm(signatureData: string) {
        if (!signatureModal.data) return
        const success = await signDocument(signatureModal.data, signatureData)
        signatureModal.close()
        if (success) {
            toast.show('Documento assinado com sucesso!', 'success')
        } else {
            toast.show('Erro ao assinar documento', 'error')
        }
    }

    async function handleConfirmDelete() {
        if (!deleteModal.data) return
        const success = await deleteDocument(deleteModal.data.id)
        deleteModal.close()
        if (success) {
            toast.show('Documento excluído com sucesso!', 'success')
        } else {
            toast.show('Erro ao excluir documento', 'error')
        }
    }

    async function handleConfirmUndo() {
        if (!undoModal.data) return
        const success = await undoSignature(undoModal.data)
        undoModal.close()
        if (success) {
            toast.show('Assinatura removida com sucesso!', 'success')
        } else {
            toast.show('Erro ao remover assinatura', 'error')
        }
    }

    return (
        <AppLayout
            documents={documents}
            onNewClick={openCreateForm}
            onDocClick={(doc) => viewerModal.open(doc)}
        >
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        {view === 'list' ? 'Documentos' : 'Novo Documento'}
                    </h1>
                    <p className={styles.subtitle}>
                        {view === 'list'
                            ? 'Gerencie seus documentos e assinaturas'
                            : 'Crie um novo documento'}
                    </p>
                </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />

            {view === 'create' && (
                <Modal
                    isOpen={createModal.isOpen}
                    onClose={closeCreateForm}
                    title="Novo Documento"
                    size="lg"
                >
                    <div className={styles.formContent}>
                        <DocumentForm onSubmit={handleCreate} />
                        <div className={styles.uploadSection}>
                            <FileUpload files={newFiles} onFilesChange={setNewFiles} />
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.btnSecondary} onClick={closeCreateForm}>
                                Cancelar
                            </button>
                            <button
                                className={styles.btnPrimarySmall}
                                onClick={() => document.getElementById('document-submit')?.click()}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? <><Loader2 size={14} className="spin" /> Criando...</>
                                    : 'Criar Documento'
                                }
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {view === 'list' && (
                <>
                    {loading ? (
                        <div className={styles.loading}>
                            <Loader2 size={24} className="spin" />
                            Carregando documentos...
                        </div>
                    ) : (
                        <>
                            <DocumentList
                                documents={documents}
                                onToggleStatus={handleToggleStatus}
                                onDelete={(doc) => deleteModal.open(doc)}
                                onView={(doc) => viewerModal.open(doc)}
                            />
                            {totalPages > 1 && (
                                <div className={styles.pagination}>
                                    <button
                                        className={styles.paginationBtn}
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                    >
                                        ← Anterior
                                    </button>
                                    <span className={styles.paginationInfo}>
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        className={styles.paginationBtn}
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                    >
                                        Próximo →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            <DocumentViewer
                doc={viewerModal.data}
                isOpen={viewerModal.isOpen}
                onClose={viewerModal.close}
                onSign={() => {
                    if (viewerModal.data) {
                        signatureModal.open(viewerModal.data)
                        viewerModal.close()
                    }
                }}
                onDelete={() => {
                    if (viewerModal.data) {
                        viewerModal.close()
                        deleteModal.open(viewerModal.data)
                    }
                }}
            />

            <SignatureModal
                isOpen={signatureModal.isOpen}
                onClose={signatureModal.close}
                onConfirm={handleSignatureConfirm}
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.close}
                onConfirm={handleConfirmDelete}
                title="Excluir Documento"
                message={`Tem certeza que deseja excluir o documento "${deleteModal.data?.titulo}"?`}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={undoModal.isOpen}
                onClose={undoModal.close}
                onConfirm={handleConfirmUndo}
                title="Remover Assinatura"
                message={`Deseja remover a assinatura do documento "${undoModal.data?.titulo}"?`}
                confirmText="Remover"
                cancelText="Cancelar"
                variant="warning"
                isLoading={isSubmitting}
            />
        </AppLayout>
    )
}
