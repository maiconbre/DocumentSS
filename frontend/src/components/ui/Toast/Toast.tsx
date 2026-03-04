'use client'

import { ToastType } from '../../../hooks/useToast'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'
import styles from './Toast.module.css'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContainerProps {
    toasts: Toast[]
    onDismiss: (id: string) => void
}

function getIcon(type: ToastType) {
    switch (type) {
        case 'success': return <CheckCircle2 size={18} />
        case 'error': return <XCircle size={18} />
        case 'warning': return <AlertTriangle size={18} />
    }
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
    if (toasts.length === 0) return null

    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
                    <span className={styles.icon}>{getIcon(toast.type)}</span>
                    <span className={styles.message}>{toast.message}</span>
                    <button className={styles.close} onClick={() => onDismiss(toast.id)} aria-label="Fechar notificação">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    )
}
