'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose} role="presentation">
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className={styles.header}>
                    <h2 className={styles.title} id="modal-title">{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
                        <X size={18} />
                    </button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}
