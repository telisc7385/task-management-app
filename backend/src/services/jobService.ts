import { JobRepository } from '../repositories/jobRepository';
import { NotFoundError, ConflictError } from '../utils/errors';
import { parseCsvFile, CsvRow } from '../utils/csvParser';

export class JobService {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async getAll(options?: { search?: string; emailStatus?: string; page?: number; limit?: number }) {
    return this.jobRepository.findAll(options);
  }

  async getById(id: number) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundError('Job');
    return job;
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
    const existing = await this.jobRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Job with this email already exists');
    return this.jobRepository.create(data);
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
      notes?: string;
      resumeFileName?: string;
    }
  ) {
    await this.getById(id);
    return this.jobRepository.update(id, data);
  }

  async delete(id: number) {
    await this.getById(id);
    return this.jobRepository.delete(id);
  }

  async importCsv(filePath: string): Promise<{ imported: number; skipped: number }> {
    const rows = await parseCsvFile(filePath);
    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      try {
        const existing = await this.jobRepository.findByEmail(row.email);
        if (existing) {
          skipped++;
          continue;
        }
        await this.jobRepository.create(row);
        imported++;
      } catch {
        skipped++;
      }
    }

    return { imported, skipped };
  }

  async getStats() {
    return this.jobRepository.getStats();
  }
}
