import { PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }
}
