import { PrismaClient } from '@prisma/client';
import { Subject } from '@prisma/client';

export class SubjectService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSubject(data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.subject.create({
      data
    });
  }

  async getSubject(id: string) {
    return this.prisma.subject.findUnique({
      where: { id }
    });
  }

  async updateSubject(id: string, data: Partial<Subject>) {
    return this.prisma.subject.update({
      where: { id },
      data
    });
  }

  async deleteSubject(id: string) {
    return this.prisma.subject.delete({
      where: { id }
    });
  }

  async listSubjects(filters?: {
    yearGroup?: number;
  }) {
    return this.prisma.subject.findMany({
      where: filters,
      orderBy: {
        name: 'asc'
      }
    });
  }

  async getSubjectsByYearGroup(yearGroup: number) {
    return this.prisma.subject.findMany({
      where: { yearGroup },
      orderBy: {
        name: 'asc'
      }
    });
  }
} 