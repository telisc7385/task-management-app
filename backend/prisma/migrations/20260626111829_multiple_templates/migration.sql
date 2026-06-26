-- AlterTable
ALTER TABLE "EmailTemplate" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Default';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "emailTemplateId" INTEGER,
ADD COLUMN     "whatsappTemplateId" INTEGER;

-- AlterTable
ALTER TABLE "WhatsappTemplate" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Default';

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_emailTemplateId_fkey" FOREIGN KEY ("emailTemplateId") REFERENCES "EmailTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_whatsappTemplateId_fkey" FOREIGN KEY ("whatsappTemplateId") REFERENCES "WhatsappTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
