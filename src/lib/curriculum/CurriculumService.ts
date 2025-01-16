import { PrismaClient } from '@prisma/client';
import type { Subject } from '@prisma/client';

const prisma = new PrismaClient();

// Use subject instead of concept
export async function getSubjects() {
  return prisma.subject.findMany();
}

export async function getSubjectById(id: string) {
  return prisma.subject.findUnique({
    where: { id }
  });
} 