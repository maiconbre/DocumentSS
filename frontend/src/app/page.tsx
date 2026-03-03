'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import { Document } from '../types/document'
import { DocumentForm } from '../components/document-form'
import { DocumentList } from '../components/document-list'
import styles from './page.module.css'

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    try {
      setError(null)
      const response = await api.getDocuments()
      setDocuments(response.data)
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

  async function handleCreate(data: { titulo: string; descricao?: string }) {
    await api.createDocument(data)
    await fetchDocuments()
  }

  async function handleToggleStatus(id: string, currentStatus: 'PENDENTE' | 'ASSINADO') {
    const newStatus = currentStatus === 'PENDENTE' ? 'ASSINADO' : 'PENDENTE'
    await api.updateDocumentStatus(id, newStatus)
    await fetchDocuments()
  }

  async function handleDelete(id: string) {
    await api.deleteDocument(id)
    await fetchDocuments()
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>📄 DocumentSS</h1>
        <p>Gerenciamento de Documentos</p>
      </header>

      <div className={styles.content}>
        <DocumentForm onSubmit={handleCreate} />

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : (
          <DocumentList
            documents={documents}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  )
}
