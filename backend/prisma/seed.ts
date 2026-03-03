import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.document.deleteMany()

    await prisma.document.createMany({
        data: [
            {
                titulo: 'Contrato de Prestação de Serviços',
                descricao: 'Contrato referente à prestação de serviços de desenvolvimento de software.',
                status: 'PENDENTE',
            },
            {
                titulo: 'Termo de Confidencialidade',
                descricao: 'NDA para proteção de informações proprietárias.',
                status: 'ASSINADO',
            },
            {
                titulo: 'Proposta Comercial',
                descricao: 'Proposta para o projeto de modernização do sistema legado.',
                status: 'PENDENTE',
            },
        ],
    })

    console.log('✅ Seed executado com sucesso!')
}

main()
    .catch((error) => {
        console.error('❌ Erro ao executar seed:', error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
