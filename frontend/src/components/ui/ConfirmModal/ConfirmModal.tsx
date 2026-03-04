'use client'

import { Modal } from '../Modal/Modal'
import { AlertTriangle, HelpCircle, Loader2 } from 'lucide-react'
import styles from './ConfirmModal.module.css'

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning'
    isLoading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false,
}: ConfirmModalProps) {


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className={styles.content}>
                <div className={`${styles.icon} ${styles[variant]}`}>
                    {variant === 'danger'
                        ? <AlertTriangle size={28} />
                        : <HelpCircle size={28} />
                    }
                </div>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.btnCancel} onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.btnConfirm} ${styles[variant]}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <><Loader2 size={14} className={styles.spin} /> Processando...</>
                            : confirmText
                        }
                    </button>
                </div>
            </div>
        </Modal>
    )
}
