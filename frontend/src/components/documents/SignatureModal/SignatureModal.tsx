'use client'

import { useRef, useState, useEffect } from 'react'
import { Modal } from '../../ui/Modal/Modal'
import { X, Loader2, Check, Eraser } from 'lucide-react'
import styles from './SignatureModal.module.css'

interface SignatureModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (signatureData: string) => void
    isLoading?: boolean
}

export function SignatureModal({ isOpen, onClose, onConfirm, isLoading = false }: SignatureModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasSignature, setHasSignature] = useState(false)

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.strokeStyle = '#1f2937'
                ctx.lineWidth = 2
                ctx.lineCap = 'round'
                ctx.lineJoin = 'round'
            }
            setTimeout(() => setHasSignature(false), 0)
        }
    }, [isOpen])

    function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        setIsDrawing(true)
        setHasSignature(true)

        const rect = canvas.getBoundingClientRect()
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()
    }

    function stopDrawing() {
        setIsDrawing(false)
    }

    function clearCanvas() {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setHasSignature(false)
    }

    function confirmSignature() {
        const canvas = canvasRef.current
        if (!canvas) return

        const signatureData = canvas.toDataURL('image/png')
        onConfirm(signatureData)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Assinar Documento" size="sm">
            <div className={styles.content}>
                <p className={styles.instruction}>
                    Faça o rabisco abaixo para assinar:
                </p>

                <div className={styles.canvasWrapper}>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className={styles.canvas}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className={styles.hint}>
                    Assine no quadro acima
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.btnClear}
                        onClick={clearCanvas}
                    >
                        <Eraser size={14} /> Limpar
                    </button>
                    <button
                        type="button"
                        className={styles.btnCancel}
                        onClick={onClose}
                    >
                        <X size={14} /> Cancelar
                    </button>
                    <button
                        type="button"
                        className={styles.btnConfirm}
                        onClick={confirmSignature}
                        disabled={!hasSignature || isLoading}
                    >
                        {isLoading
                            ? <><Loader2 size={14} className={styles.spin} /> Processando...</>
                            : <><Check size={14} /> Confirmar</>
                        }
                    </button>
                </div>
            </div>
        </Modal>
    )
}
