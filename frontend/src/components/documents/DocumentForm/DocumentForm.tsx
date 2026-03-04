'use client'

import { useState } from 'react'
import styles from './DocumentForm.module.css'

interface DocumentFormProps {
    onSubmit: (data: { titulo: string; descricao: string }) => void
    isLoading?: boolean
}

export function DocumentForm({ onSubmit, isLoading = false }: DocumentFormProps) {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tituloError, setTituloError] = useState('')
    const [touched, setTouched] = useState(false)

    function validateTitulo(value: string) {
        if (!value.trim()) {
            return 'O título é obrigatório'
        }
        if (value.trim().length < 3) {
            return 'O título deve ter pelo menos 3 caracteres'
        }
        return ''
    }

    function handleTituloChange(value: string) {
        setTitulo(value)
        if (touched) {
            setTituloError(validateTitulo(value))
        }
    }

    function handleTituloBlur() {
        setTouched(true)
        setTituloError(validateTitulo(titulo))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const error = validateTitulo(titulo)
        setTouched(true)
        setTituloError(error)

        if (error) return

        onSubmit({ titulo: titulo.trim(), descricao: descricao.trim() })
        setTitulo('')
        setDescricao('')
        setTouched(false)
        setTituloError('')
    }

    const isValid = !validateTitulo(titulo)

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label htmlFor="titulo" className={styles.label}>Título *</label>
                <input
                    id="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => handleTituloChange(e.target.value)}
                    onBlur={handleTituloBlur}
                    placeholder="Nome do documento"
                    className={`${styles.input} ${touched && tituloError ? styles.inputError : ''}`}
                    aria-invalid={touched && !!tituloError}
                    aria-describedby={tituloError ? 'titulo-error' : undefined}
                />
                {touched && tituloError && (
                    <span id="titulo-error" className={styles.errorText}>{tituloError}</span>
                )}
            </div>
            <div className={styles.field}>
                <label htmlFor="descricao" className={styles.label}>Descrição</label>
                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição opcional"
                    className={styles.textarea}
                    rows={3}
                />
            </div>
            <button
                type="submit"
                id="document-submit"
                className={styles.submitBtn}
                style={{ display: 'none' }}
                disabled={!isValid || isLoading}
            >
                Criar
            </button>
        </form>
    )
}
