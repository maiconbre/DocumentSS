import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Pequeno PNG 1x1 transparente em base64 para simular arquivos de imagem
const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

// Pequeno PDF fake em base64 para simular arquivos PDF
const TINY_PDF = 'data:application/pdf;base64,JVBERi0xLjEKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE5NQolJUVPRg=='

interface SeedDocument {
    titulo: string
    descricao: string
    status: 'PENDENTE' | 'ASSINADO'
    arquivos?: { name: string; type: string; data: string }[]
}

const documents: SeedDocument[] = [
    {
        titulo: 'Contrato de Prestação de Serviços',
        descricao: 'Contrato referente à prestação de serviços de desenvolvimento de software para a empresa XYZ Ltda.',
        status: 'PENDENTE',
        arquivos: [
            { name: 'contrato_servicos.pdf', type: 'application/pdf', data: TINY_PDF },
        ],
    },
    {
        titulo: 'Termo de Confidencialidade (NDA)',
        descricao: 'Acordo de não divulgação para proteção de informações proprietárias do projeto Alpha.',
        status: 'ASSINADO',
        arquivos: [
            { name: 'nda_assinado.pdf', type: 'application/pdf', data: TINY_PDF },
            { name: 'assinatura.png', type: 'image/png', data: TINY_PNG },
        ],
    },
    {
        titulo: 'Proposta Comercial — Modernização',
        descricao: 'Proposta técnica e comercial para modernização do sistema legado de gestão de estoque.',
        status: 'PENDENTE',
    },
    {
        titulo: 'Ata de Reunião — Sprint Planning',
        descricao: 'Registro da reunião de planejamento da Sprint 12, com definições de escopo e prioridades.',
        status: 'ASSINADO',
        arquivos: [
            { name: 'ata_sprint12.pdf', type: 'application/pdf', data: TINY_PDF },
            { name: 'assinatura.png', type: 'image/png', data: TINY_PNG },
        ],
    },
    {
        titulo: 'Relatório Mensal de Atividades',
        descricao: 'Relatório detalhado das atividades realizadas no mês de fevereiro de 2026.',
        status: 'PENDENTE',
        arquivos: [
            { name: 'relatorio_fev2026.pdf', type: 'application/pdf', data: TINY_PDF },
        ],
    },
    {
        titulo: 'Contrato de Trabalho CLT',
        descricao: 'Contrato individual de trabalho por prazo indeterminado para o cargo de Desenvolvedor Full Stack.',
        status: 'ASSINADO',
        arquivos: [
            { name: 'contrato_clt.pdf', type: 'application/pdf', data: TINY_PDF },
            { name: 'documento_identidade.png', type: 'image/png', data: TINY_PNG },
            { name: 'assinatura.png', type: 'image/png', data: TINY_PNG },
        ],
    },
    {
        titulo: 'Política de Privacidade (LGPD)',
        descricao: 'Documento de política de privacidade e proteção de dados conforme a Lei Geral de Proteção de Dados.',
        status: 'PENDENTE',
    },
    {
        titulo: 'Termo de Aceite do Projeto',
        descricao: 'Formalização do aceite da entrega final do projeto Beta pela equipe de QA.',
        status: 'ASSINADO',
        arquivos: [
            { name: 'aceite_projeto_beta.pdf', type: 'application/pdf', data: TINY_PDF },
            { name: 'assinatura.png', type: 'image/png', data: TINY_PNG },
        ],
    },
    {
        titulo: 'Orçamento — Infraestrutura Cloud',
        descricao: 'Estimativa de custos para migração de infraestrutura on-premise para AWS com análise de TCO.',
        status: 'PENDENTE',
        arquivos: [
            { name: 'orcamento_cloud.pdf', type: 'application/pdf', data: TINY_PDF },
            { name: 'diagrama_arquitetura.png', type: 'image/png', data: TINY_PNG },
        ],
    },
    {
        titulo: 'Manual do Usuário — v1.0',
        descricao: 'Guia completo de utilização do sistema DocumentSS para novos colaboradores.',
        status: 'PENDENTE',
    },
]

async function main() {
    // Limpa dados existentes
    await prisma.documentFile.deleteMany()
    await prisma.document.deleteMany()

    console.log('🗑️  Dados anteriores removidos.\n')

    for (const doc of documents) {
        const created = await prisma.document.create({
            data: {
                titulo: doc.titulo,
                descricao: doc.descricao,
                status: doc.status,
                arquivos: doc.arquivos
                    ? {
                        create: doc.arquivos.map((f) => ({
                            name: f.name,
                            type: f.type,
                            data: f.data,
                        })),
                    }
                    : undefined,
            },
        })

        const filesCount = doc.arquivos?.length ?? 0
        const statusIcon = doc.status === 'ASSINADO' ? '✅' : '⏳'
        console.log(`  ${statusIcon} ${created.titulo} (${filesCount} arquivo${filesCount !== 1 ? 's' : ''})`)
    }

    console.log(`\n✅ Seed concluído! ${documents.length} documentos inseridos.`)
}

main()
    .catch((error) => {
        console.error('❌ Erro ao executar seed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
