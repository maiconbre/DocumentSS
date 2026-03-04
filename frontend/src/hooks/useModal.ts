'use client'

import { useState, useCallback } from 'react'

interface ModalState<T = unknown> {
    isOpen: boolean
    data: T | null
}

export function useModal<T = unknown>() {
    const [state, setState] = useState<ModalState<T>>({
        isOpen: false,
        data: null,
    })

    const open = useCallback((data?: T) => {
        setState({ isOpen: true, data: data ?? null })
    }, [])

    const close = useCallback(() => {
        setState({ isOpen: false, data: null })
    }, [])

    return {
        isOpen: state.isOpen,
        data: state.data,
        open,
        close,
    }
}
