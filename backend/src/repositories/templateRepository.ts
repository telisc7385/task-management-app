import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class TemplateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async listEmailTemplates() {
    return this.prisma.emailTemplate.findMany({ orderBy: { id: 'asc' } });
  }

  async getEmailTemplateById(id: number) {
    return this.prisma.emailTemplate.findUnique({ where: { id } });
  }

  async createEmailTemplate(data: { name: string; subject: string; body: string }) {
    return this.prisma.emailTemplate.create({ data });
  }

  async updateEmailTemplate(id: number, data: { name?: string; subject?: string; body?: string }) {
    return this.prisma.emailTemplate.update({ where: { id }, data });
  }

  async deleteEmailTemplate(id: number) {
    return this.prisma.emailTemplate.delete({ where: { id } });
  }

  async listWhatsappTemplates() {
    return this.prisma.whatsappTemplate.findMany({ orderBy: { id: 'asc' } });
  }

  async getWhatsappTemplateById(id: number) {
    return this.prisma.whatsappTemplate.findUnique({ where: { id } });
  }

  async createWhatsappTemplate(data: { name: string; body: string }) {
    return this.prisma.whatsappTemplate.create({ data });
  }

  async updateWhatsappTemplate(id: number, data: { name?: string; body?: string }) {
    return this.prisma.whatsappTemplate.update({ where: { id }, data });
  }

  async deleteWhatsappTemplate(id: number) {
    return this.prisma.whatsappTemplate.delete({ where: { id } });
  }
}
