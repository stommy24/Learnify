import prisma from '@/lib/db';
import { Concept } from '@prisma/client';

export class CurriculumService {
  async getConceptsBySubject(subjectId: string): Promise<Concept[]> {
    return await prisma.concept.findMany({
      where: { subjectId }
    });
  }

  async getPrerequisites(conceptId: string): Promise<Concept[]> {
    return await prisma.concept.findMany({
      where: {
        prerequisites: {
          some: {
            id: conceptId
          }
        }
      }
    });
  }
} 