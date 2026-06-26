import { TemplateRepository } from '../repositories/templateRepository';
import { NotFoundError } from '../utils/errors';

const DEFAULT_EMAIL_SUBJECT = 'Application for {role} – Suchit Teli';
const DEFAULT_EMAIL_BODY = `Dear {hrName},\n\nI hope you are doing well.\n\nI am interested in the {role} position at {company}.\n\nPlease find my resume attached for your consideration.\n\nThank you.\n\nRegards,\nSuchit Teli`;
const DEFAULT_WHATSAPP_BODY = `Hi {hrName},\n\nI am interested in the {role} position at {company}. Please find my resume attached.\n\nRegards,\nSuchit Teli`;

export class TemplateService {
  private templateRepository: TemplateRepository;

  constructor() {
    this.templateRepository = new TemplateRepository();
  }

  async listEmailTemplates() {
    return this.templateRepository.listEmailTemplates();
  }

  async getEmailTemplateById(id: number) {
    const template = await this.templateRepository.getEmailTemplateById(id);
    if (!template) throw new NotFoundError('Email template');
    return template;
  }

  async createEmailTemplate(data: { name: string; subject: string; body: string }) {
    return this.templateRepository.createEmailTemplate(data);
  }

  async updateEmailTemplate(id: number, data: { name?: string; subject?: string; body?: string }) {
    await this.getEmailTemplateById(id);
    return this.templateRepository.updateEmailTemplate(id, data);
  }

  async deleteEmailTemplate(id: number) {
    await this.getEmailTemplateById(id);
    return this.templateRepository.deleteEmailTemplate(id);
  }

  async listWhatsappTemplates() {
    return this.templateRepository.listWhatsappTemplates();
  }

  async getWhatsappTemplateById(id: number) {
    const template = await this.templateRepository.getWhatsappTemplateById(id);
    if (!template) throw new NotFoundError('WhatsApp template');
    return template;
  }

  async createWhatsappTemplate(data: { name: string; body: string }) {
    return this.templateRepository.createWhatsappTemplate(data);
  }

  async updateWhatsappTemplate(id: number, data: { name?: string; body?: string }) {
    await this.getWhatsappTemplateById(id);
    return this.templateRepository.updateWhatsappTemplate(id, data);
  }

  async deleteWhatsappTemplate(id: number) {
    await this.getWhatsappTemplateById(id);
    return this.templateRepository.deleteWhatsappTemplate(id);
  }

  getDefaultEmailTemplate() {
    return { subject: DEFAULT_EMAIL_SUBJECT, body: DEFAULT_EMAIL_BODY };
  }

  getDefaultWhatsappTemplate() {
    return { body: DEFAULT_WHATSAPP_BODY };
  }
}
