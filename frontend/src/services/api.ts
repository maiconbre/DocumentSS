import { Document, CreateDocumentInput, PaginatedResponse } from '../types/document'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {}
    if (options?.body) {
        headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE}${url}`, {
        headers,
        ...options,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `Erro ${response.status}`)
    }

    if (response.status === 204) return undefined as T

    return response.json()
}

export const api = {
    getDocuments(page = 1, limit = 10): Promise<PaginatedResponse<Document>> {
        return request(`/documents?page=${page}&limit=${limit}`)
    },

    createDocument(data: CreateDocumentInput): Promise<Document> {
        return request('/documents', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    updateDocumentStatus(id: string, status: 'PENDENTE' | 'ASSINADO'): Promise<Document> {
        return request(`/documents/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        })
    },

    deleteDocument(id: string): Promise<void> {
        return request(`/documents/${id}`, {
            method: 'DELETE',
        })
    },
}
