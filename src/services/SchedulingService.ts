import { prisma } from '@/lib/db';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { logger } from '@/lib/monitoring';

interface StudySchedule {
  userId: string;
  preferredTimes: {
    dayOfWeek: number; // 0-6
    startTime: string; // HH:mm
    duration: number; // minutes
  }[];
  subjects: {
    name: string;
    priority: number; // 1-3
  }[];
}

interface ScheduledSession {
  id: string;
  userId: string;
  subject: string;
  startTime: Date;
  duration: number;
  type: 'LESSON' | 'PRACTICE' | 'ASSESSMENT';
  status: 'SCHEDULED' | 'COMPLETED' | 'MISSED';
}

export class SchedulingService {
  async updateStudySchedule(
    schedule: StudySchedule
  ): Promise<void> {
    try {
      await prisma.studySchedule.upsert({
        where: { userId: schedule.userId },
        update: {
          preferredTimes: schedule.preferredTimes,
          subjects: schedule.subjects
        },
        create: {
          userId: schedule.userId,
          preferredTimes: schedule.preferredTimes,
          subjects: schedule.subjects
        }
      });

      await this.generateUpcomingSessions(schedule);
    } catch (error) {
      logger.error('Failed to update study schedule', {
        userId: schedule.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async getUpcomingSessions(
    userId: string,
    days: number = 7
  ): Promise<ScheduledSession[]> {
    try {
      const endDate = addDays(new Date(), days);

      return await prisma.studySession.findMany({
        where: {
          userId,
          startTime: {
            gte: startOfDay(new Date()),
            lte: endOfDay(endDate)
          },
          status: 'SCHEDULED'
        },
        orderBy: {
          startTime: 'asc'
        }
      });
    } catch (error) {
      logger.error('Failed to get upcoming sessions', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async generateUpcomingSessions(
    schedule: StudySchedule
  ): Promise<void> {
    try {
      // Clear existing future sessions
      await prisma.studySession.deleteMany({
        where: {
          userId: schedule.userId,
          startTime: { gte: new Date() },
          status: 'SCHEDULED'
        }
      });

      const sessions: any[] = [];
      const daysToSchedule = 7;

      for (let day = 0; day < daysToSchedule; day++) {
        const date = addDays(new Date(), day);
        const dayOfWeek = date.getDay();

        const timeslots = schedule.preferredTimes.filter(
          t => t.dayOfWeek === dayOfWeek
        );

        for (const slot of timeslots) {
          const [hours, minutes] = slot.startTime.split(':');
          const startTime = new Date(date);
          startTime.setHours(parseInt(hours), parseInt(minutes));

          // Rotate through subjects based on priority
          const subject = this.getNextSubject(
            schedule.subjects,
            day,
            slot
          );

          sessions.push({
            userId: schedule.userId,
            subject: subject.name,
            startTime,
            duration: slot.duration,
            type: this.determineSessionType(subject, day),
            status: 'SCHEDULED'
          });
        }
      }

      if (sessions.length > 0) {
        await prisma.studySession.createMany({
          data: sessions
        });
      }
    } catch (error) {
      logger.error('Failed to generate upcoming sessions', {
        userId: schedule.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private getNextSubject(
    subjects: StudySchedule['subjects'],
    day: number,
    slot: StudySchedule['preferredTimes'][0]
  ) {
    // Implement subject rotation logic based on priority
    return subjects[0];
  }

  private determineSessionType(
    subject: StudySchedule['subjects'][0],
    day: number
  ): ScheduledSession['type'] {
    // Implement session type determination logic
    return 'PRACTICE';
  }

  async markSessionComplete(
    sessionId: string,
    duration: number
  ): Promise<void> {
    try {
      await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          duration
        }
      });
    } catch (error) {
      logger.error('Failed to mark session complete', {
        sessionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
} 