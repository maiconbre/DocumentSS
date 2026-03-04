-- CreateTable
CREATE TABLE "document_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,

    CONSTRAINT "document_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "document_files" ADD CONSTRAINT "document_files_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
