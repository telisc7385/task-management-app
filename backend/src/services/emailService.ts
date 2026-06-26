import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { JobRepository } from '../repositories/jobRepository';
import { TemplateRepository } from '../repositories/templateRepository';
import { AppError } from '../utils/errors';

export class EmailService {
  private jobRepository: JobRepository;
  private templateRepository: TemplateRepository;

  constructor() {
    this.jobRepository = new JobRepository();
    this.templateRepository = new TemplateRepository();
  }

  private getTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(jobId: number): Promise<{ success: boolean; message: string }> {
    const job = await this.jobRepository.findById(jobId);
    if (!job) throw new AppError('Job not found', 404);

    let subject: string;
    let body: string;

    if (job.emailTemplateId) {
      const template = await this.templateRepository.getEmailTemplateById(job.emailTemplateId);
      if (!template) throw new AppError('Selected email template not found', 404);
      subject = template.subject;
      body = template.body;
    } else {
      const templates = await this.templateRepository.listEmailTemplates();
      if (templates.length === 0) throw new AppError('No email templates configured. Create one first.', 400);
      subject = templates[0].subject;
      body = templates[0].body;
    }

    subject = subject
      .replace(/\{company\}/g, job.companyName)
      .replace(/\{role\}/g, job.role)
      .replace(/\{hrName\}/g, job.hrName);

    body = body
      .replace(/\{company\}/g, job.companyName)
      .replace(/\{role\}/g, job.role)
      .replace(/\{hrName\}/g, job.hrName);

    const attachments: nodemailer.SendMailOptions['attachments'] = [];

    if (job.resumeFileName) {
      const resumeDir = path.resolve(__dirname, '..', '..', 'uploads', 'resumes');
      const resumePath = path.join(resumeDir, job.resumeFileName);
      if (fs.existsSync(resumePath)) {
        const displayName = job.resumeFileName.replace(/-\d+-\d+(?=\.\w+$)/, '');
        attachments.push({
          filename: displayName,
          path: resumePath,
        });
        console.log(`[EmailService] Attaching resume: ${resumePath}`);
      } else {
        console.warn(`[EmailService] Resume file NOT FOUND at: ${resumePath}`);
      }
    } else {
      console.warn(`[EmailService] No resumeFileName set for job ${jobId}`);
    }

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: `"Job Application" <${process.env.SMTP_USER}>`,
        to: job.email,
        subject,
        text: body,
        attachments,
      });

      await this.jobRepository.update(jobId, { emailStatus: 'Sent' });
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      await this.jobRepository.update(jobId, { emailStatus: 'Failed' });
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: `Failed to send email: ${errMsg}` };
    }
  }
}
