'use client'

import { useRef, useState } from 'react'
import { DocumentFile } from '../../../types/document'
import { Paperclip, FileText, Image, X } from 'lucide-react'
import styles from './FileUpload.module.css'

interface FileUploadProps {
    files: DocumentFile[]
    onFilesChange: (files: DocumentFile[]) => void
    onError?: (message: string) => void
    maxFiles?: number
    maxSizeMB?: number
}

export function FileUpload({ files, onFilesChange, onError, maxFiles = 5, maxSizeMB = 10 }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)

    const acceptedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
    ]

    function getFileIcon(type: string) {
        if (type === 'application/pdf') return <FileText size={18} color="#ef4444" />
        if (type.startsWith('image/')) return <Image size={18} color="#6366f1" />
        return <FileText size={18} color="#6b7280" />
    }

    function formatFileSize(bytes: number) {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    async function processFiles(fileList: FileList | File[]) {
        const newFiles: DocumentFile[] = []

        for (const file of Array.from(fileList)) {
            if (!acceptedTypes.includes(file.type)) {
                onError?.(`Tipo não aceito: ${file.name}. Use PDF, PNG ou JPG.`)
                continue
            }

            if (file.size > maxSizeMB * 1024 * 1024) {
                onError?.(`Arquivo muito grande: ${file.name}. Máximo: ${maxSizeMB}MB.`)
                continue
            }

            if (files.length + newFiles.length >= maxFiles) {
                onError?.(`Máximo de ${maxFiles} arquivos atingido.`)
                break
            }

            const data = await readFileAsBase64(file)
            newFiles.push({
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                data,
            })
        }

        if (newFiles.length > 0) {
            onFilesChange([...files, ...newFiles])
        }
    }

    function readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    function removeFile(id: string) {
        onFilesChange(files.filter((f) => f.id !== id))
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        processFiles(e.dataTransfer.files)
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(true)
    }

    function handleDragLeave() {
        setDragOver(false)
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            processFiles(e.target.files)
            e.target.value = ''
        }
    }

    return (
        <div className={styles.wrapper}>
            <div
                className={`${styles.dropzone} ${dragOver ? styles.active : ''}`}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleInputChange}
                    className={styles.input}
                />
                <Paperclip size={20} color="#9ca3af" />
                <p className={styles.text}>
                    Arraste arquivos aqui ou <span className={styles.link}>clique para selecionar</span>
                </p>
                <span className={styles.hint}>
                    PDF, PNG ou JPG (máx {maxSizeMB}MB, até {maxFiles} arquivos)
                </span>
            </div>

            {files.length > 0 && (
                <ul className={styles.fileList}>
                    {files.map((file) => (
                        <li key={file.id} className={styles.fileItem}>
                            <span className={styles.fileIcon}>{getFileIcon(file.type)}</span>
                            <div className={styles.fileInfo}>
                                {file.type.startsWith('image/') && (
                                    <img
                                        src={file.data}
                                        alt={file.name}
                                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 4 }}
                                    />
                                )}
                                <span className={styles.fileName}>{file.name}</span>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeFile(file.id)
                                }}
                                aria-label={`Remover ${file.name}`}
                            >
                                <X size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
