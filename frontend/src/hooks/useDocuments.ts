'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { Document, DocumentFile, CreateDocumentInput } from '../types/document'

export function useDocuments() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchDocuments = useCallback(async (page = 1) => {
        try {
            setError(null)
            setLoading(true)
            const response = await api.getDocuments(page, 10)
            setDocuments(response.data)
            setCurrentPage(response.meta?.page ?? page)
            setTotalPages(response.meta?.totalPages ?? 1)
        } catch (err) {
            setError('Erro ao carregar documentos')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    async function createDocument(data: CreateDocumentInput, files: DocumentFile[]) {
        setIsSubmitting(true)
        try {
            const doc = await api.createDocument(data)
            if (files.length > 0) {
                await api.addFiles(doc.id, files)
            }
            await fetchDocuments(currentPage)
            return true
        } catch (err) {
            setError('Erro ao criar documento')
            console.error(err)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    async function signDocument(doc: Document, signatureData: string) {
        setIsSubmitting(true)
        try {
            await api.addFiles(doc.id, [{
                name: 'assinatura.png',
                type: 'image/png',
                data: signatureData,
            }])
            await api.updateDocumentStatus(doc.id, 'ASSINADO')
            await fetchDocuments(currentPage)
            return true
        } catch (err) {
            setError('Erro ao assinar documento')
            console.error(err)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    async function deleteDocument(id: string) {
        setIsSubmitting(true)
        try {
            await api.deleteDocument(id)
            await fetchDocuments(currentPage)
            return { success: true }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir documento'
            setError(errorMessage)
            console.error(err)
            return { success: false, error: errorMessage }
        } finally {
            setIsSubmitting(false)
        }
    }

    async function undoSignature(doc: Document) {
        setIsSubmitting(true)
        try {
            const signatureFiles = doc.arquivos?.filter((f) =>
                f.name.toLowerCase().includes('assinatura')
            ) || []

            for (const file of signatureFiles) {
                await api.deleteFile(doc.id, file.id)
            }

            await api.updateDocumentStatus(doc.id, 'PENDENTE')
            await fetchDocuments(currentPage)
            return true
        } catch (err) {
            setError('Erro ao remover assinatura')
            console.error(err)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    function goToPage(page: number) {
        fetchDocuments(page)
    }

    return {
        documents,
        loading,
        error,
        isSubmitting,
        currentPage,
        totalPages,
        goToPage,
        createDocument,
        signDocument,
        deleteDocument,
        undoSignature,
    }
}
