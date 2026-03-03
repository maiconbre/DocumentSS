-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDENTE', 'ASSINADO');

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
