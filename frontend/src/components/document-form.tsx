'use client'

import { useState } from 'react'
import styles from './document-form.module.css'

interface DocumentFormProps {
    onSubmit: (data: { titulo: string; descricao?: string }) => Promise<void>
}

export function DocumentForm({ onSubmit }: DocumentFormProps) {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!titulo.trim()) return

        setLoading(true)
        try {
            await onSubmit({
                titulo: titulo.trim(),
                descricao: descricao.trim() || undefined,
            })
            setTitulo('')
            setDescricao('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Novo Documento</h2>

            <div className={styles.field}>
                <label htmlFor="titulo">Título *</label>
                <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Contrato de Serviço"
                    required
                    maxLength={255}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição opcional do documento"
                    rows={3}
                    maxLength={2000}
                />
            </div>

            <button type="submit" className={styles.button} disabled={loading || !titulo.trim()}>
                {loading ? 'Criando...' : 'Criar Documento'}
            </button>
        </form>
    )
}
