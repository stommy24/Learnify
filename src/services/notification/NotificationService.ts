import { PrismaClient } from '@prisma/client';

export class NotificationService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createNotification(data: {
    userId: string;
    type: 'assessment' | 'feedback' | 'reminder' | 'system';
    title: string;
    message: string;
    priority?: 'high' | 'medium' | 'low';
    link?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        ...data,
        read: false,
        priority: data.priority || 'medium'
      }
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  async getUserNotifications(userId: string, options?: {
    unreadOnly?: boolean;
    limit?: number;
    type?: 'assessment' | 'feedback' | 'reminder' | 'system';
  }) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(options?.unreadOnly ? { read: false } : {}),
        ...(options?.type ? { type: options.type } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: options?.limit
    });
  }

  async deleteNotification(id: string) {
    return this.prisma.notification.delete({
      where: { id }
    });
  }

  async deleteOldNotifications(daysOld: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    });
  }
} 