import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DocumentSS — Gerenciamento de Documentos',
  description: 'Sistema de gerenciamento de documentos com assinatura digital',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
