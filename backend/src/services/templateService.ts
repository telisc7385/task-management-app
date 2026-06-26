import { TemplateRepository } from '../repositories/templateRepository';

export class TemplateService {
  private templateRepository: TemplateRepository;

  constructor() {
    this.templateRepository = new TemplateRepository();
  }

  async getEmailTemplate() {
    const template = await this.templateRepository.getEmailTemplate();
    if (!template) {
      return {
        subject: 'Application for {role} – Suchit Teli',
        body: `Dear {hrName},\n\nI hope you are doing well.\n\nI am interested in the {role} position at {company}.\n\nPlease find my resume attached for your consideration.\n\nThank you.\n\nRegards,\nSuchit Teli`,
      };
    }
    return template;
  }

  async updateEmailTemplate(subject: string, body: string) {
    return this.templateRepository.upsertEmailTemplate(subject, body);
  }

  async getWhatsappTemplate() {
    const template = await this.templateRepository.getWhatsappTemplate();
    if (!template) {
      return {
        body: `Hi {hrName},\n\nI am interested in the {role} position at {company}. Please find my resume attached.\n\nRegards,\nSuchit Teli`,
      };
    }
    return template;
  }

  async updateWhatsappTemplate(body: string) {
    return this.templateRepository.upsertWhatsappTemplate(body);
  }
}
