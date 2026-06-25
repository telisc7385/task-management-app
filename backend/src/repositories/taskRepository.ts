import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class TaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findAllByUserId(
    userId: number,
    options?: {
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { status, search, page = 1, limit = 10 } = options || {};

    const where: Record<string, unknown> = { userId };

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async create(data: {
    title: string;
    description: string;
    status: string;
    userId: number;
  }) {
    return this.prisma.task.create({ data });
  }

  async update(
    id: number,
    data: { title?: string; description?: string; status?: string }
  ) {
    return this.prisma.task.update({ where: { id }, data });
  }

  async delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }

  async getStats(userId: number) {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
    };
  }
}
