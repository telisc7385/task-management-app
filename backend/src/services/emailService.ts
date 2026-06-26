import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { TemplateRepository } from '../repositories/templateRepository';
import { JobRepository } from '../repositories/jobRepository';
import { AppError } from '../utils/errors';

export class EmailService {
  private templateRepository: TemplateRepository;
  private jobRepository: JobRepository;

  constructor() {
    this.templateRepository = new TemplateRepository();
    this.jobRepository = new JobRepository();
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

    const template = await this.templateRepository.getEmailTemplate();
    if (!template) throw new AppError('Email template not configured', 400);

    const subject = template.subject
      .replace(/\{company\}/g, job.companyName)
      .replace(/\{role\}/g, job.role)
      .replace(/\{hrName\}/g, job.hrName);

    const body = template.body
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
