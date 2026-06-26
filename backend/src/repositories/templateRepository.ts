import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class TemplateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async getEmailTemplate() {
    return this.prisma.emailTemplate.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertEmailTemplate(subject: string, body: string) {
    const existing = await this.getEmailTemplate();
    if (existing) {
      return this.prisma.emailTemplate.update({ where: { id: existing.id }, data: { subject, body } });
    }
    return this.prisma.emailTemplate.create({ data: { subject, body } });
  }

  async getWhatsappTemplate() {
    return this.prisma.whatsappTemplate.findFirst({ orderBy: { id: 'asc' } });
  }

  async upsertWhatsappTemplate(body: string) {
    const existing = await this.getWhatsappTemplate();
    if (existing) {
      return this.prisma.whatsappTemplate.update({ where: { id: existing.id }, data: { body } });
    }
    return this.prisma.whatsappTemplate.create({ data: { body } });
  }
}
