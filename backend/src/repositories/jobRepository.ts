import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class JobRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findAll(options?: { search?: string; emailStatus?: string; page?: number; limit?: number }) {
    const { search, emailStatus, page = 1, limit = 50 } = options || {};

    const where: Record<string, unknown> = {};

    if (emailStatus && emailStatus !== 'All') {
      where.emailStatus = emailStatus;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.job.count({ where }),
    ]);

    return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.job.findUnique({ where: { email } });
  }

  async create(data: {
    companyName: string;
    role: string;
    hrName: string;
    email: string;
    phone?: string;
    location?: string;
    resumeFileName?: string;
  }) {
    return this.prisma.job.create({ data });
  }

  async update(
    id: number,
    data: {
      companyName?: string;
      role?: string;
      hrName?: string;
      email?: string;
      phone?: string;
      location?: string;
      emailStatus?: string;
      whatsappStatus?: string;
      notes?: string;
      resumeFileName?: string;
    }
  ) {
    return this.prisma.job.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.job.delete({ where: { id } });
  }

  async getStats() {
    const jobs = await this.prisma.job.findMany();
    return {
      total: jobs.length,
      pending: jobs.filter((j) => j.emailStatus === 'Pending').length,
      sent: jobs.filter((j) => j.emailStatus === 'Sent').length,
      failed: jobs.filter((j) => j.emailStatus === 'Failed').length,
    };
  }
}
