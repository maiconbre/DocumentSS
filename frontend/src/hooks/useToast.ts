'use client'

import { useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

export function useToast(duration = 4000) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const show = useCallback((message: string, type: ToastType = 'success') => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
    }, [duration])

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return { toasts, show, dismiss }
}
