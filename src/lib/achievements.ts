import { prisma } from './prisma';

export const ACHIEVEMENT_TYPES = {
  LESSON_COMPLETION: 'LESSON_COMPLETION',
  COURSE_COMPLETION: 'COURSE_COMPLETION',
  STREAK: 'STREAK',
  XP_MILESTONE: 'XP_MILESTONE',
  SPEED_LEARNER: 'SPEED_LEARNER',
  NIGHT_OWL: 'NIGHT_OWL',
  EARLY_BIRD: 'EARLY_BIRD',
  SOCIAL_BUTTERFLY: 'SOCIAL_BUTTERFLY',
  PERFECT_SCORE: 'PERFECT_SCORE',
  HELPING_HAND: 'HELPING_HAND',
  WEEKEND_WARRIOR: 'WEEKEND_WARRIOR',
} as const;

export const ACHIEVEMENT_CATEGORIES = {
  LEARNING: 'LEARNING',
  DEDICATION: 'DEDICATION',
  SOCIAL: 'SOCIAL',
  MILESTONES: 'MILESTONES',
  SPEED: 'SPEED',
  ACHIEVEMENT: 'ACHIEVEMENT',
  MASTERY: 'MASTERY',
  DEFAULT: 'DEFAULT',
} as const;

export const ACHIEVEMENTS = [
  {
    type: ACHIEVEMENT_TYPES.LESSON_COMPLETION,
    category: ACHIEVEMENT_CATEGORIES.LEARNING,
    name: 'First Step',
    description: 'Complete your first lesson',
    xpReward: 50,
    shareMessage: "I've taken my first step in learning! 🎓",
    condition: async (userId: string) => {
      const completedLessons = await prisma.progress.count({
        where: { 
          enrollment: { userId },
          completed: true 
        }
      });
      return completedLessons === 1;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.COURSE_COMPLETION,
    name: 'Course Master',
    description: 'Complete your first course',
    xpReward: 200,
    condition: async (userId: string) => {
      const courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: {
              userId,
              progress: {
                every: {
                  completed: true
                }
              }
            }
          }
        }
      });
      return courses.length > 0;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.STREAK,
    name: 'Weekly Warrior',
    description: 'Learn for 7 days in a row',
    xpReward: 150,
    condition: async (userId: string) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const dailyProgress = await prisma.progress.groupBy({
        by: ['createdAt'],
        where: {
          enrollment: { userId },
          createdAt: { gte: sevenDaysAgo }
        }
      });
      return dailyProgress.length >= 7;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.XP_MILESTONE,
    name: 'XP Champion',
    description: 'Earn 1000 XP',
    xpReward: 300,
    condition: async (userId: string) => {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId }
      });
      return profile?.xpPoints ?? 0 >= 1000;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.SPEED_LEARNER,
    name: 'Speed Learner',
    description: 'Complete 5 lessons in a single day',
    xpReward: 100,
    condition: async (userId: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const completedToday = await prisma.progress.count({
        where: {
          enrollment: { userId },
          completed: true,
          createdAt: { gte: today }
        }
      });
      return completedToday >= 5;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.NIGHT_OWL,
    name: 'Night Owl',
    description: 'Complete a lesson between midnight and 5 AM',
    xpReward: 75,
    condition: async (userId: string) => {
      const progress = await prisma.$queryRaw`
        SELECT * FROM "Progress" p
        JOIN "Enrollment" e ON p."enrollmentId" = e.id
        WHERE e."userId" = ${userId}
        AND p.completed = true
        AND EXTRACT(HOUR FROM p."createdAt") BETWEEN 0 AND 4
        LIMIT 1
      `;
      return Array.isArray(progress) && progress.length > 0;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.EARLY_BIRD,
    name: 'Early Bird',
    description: 'Complete a lesson before 7 AM',
    xpReward: 75,
    condition: async (userId: string) => {
      const progress = await prisma.$queryRaw`
        SELECT * FROM "Progress" p
        JOIN "Enrollment" e ON p."enrollmentId" = e.id
        WHERE e."userId" = ${userId}
        AND p.completed = true
        AND EXTRACT(HOUR FROM p."createdAt") BETWEEN 5 AND 6
        LIMIT 1
      `;
      return Array.isArray(progress) && progress.length > 0;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.PERFECT_SCORE,
    category: ACHIEVEMENT_CATEGORIES.MASTERY,
    name: 'Perfect Score',
    description: 'Complete a course with 100% accuracy',
    xpReward: 500,
    shareMessage: "I've achieved perfection! 💯",
    condition: async (userId: string) => {
      const perfectCourses = await prisma.$queryRaw`
        SELECT e.id
        FROM "Enrollment" e
        JOIN "Progress" p ON p."enrollmentId" = e.id
        WHERE e."userId" = ${userId}
        AND p.completed = true
        GROUP BY e.id
        HAVING MIN(COALESCE(p.score, 0)) = 100
      `;
      return Array.isArray(perfectCourses) && perfectCourses.length > 0;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.HELPING_HAND,
    category: ACHIEVEMENT_CATEGORIES.SOCIAL,
    name: 'Helping Hand',
    description: 'Help 5 other students by answering their questions',
    xpReward: 200,
    shareMessage: "Helping others learn is the best way to learn! 🤝",
    condition: async (userId: string) => {
      // Implement when adding forum/discussion feature
      return false;
    }
  },
  {
    type: ACHIEVEMENT_TYPES.WEEKEND_WARRIOR,
    category: ACHIEVEMENT_CATEGORIES.DEDICATION,
    name: 'Weekend Warrior',
    description: 'Complete lessons on both Saturday and Sunday',
    xpReward: 150,
    shareMessage: "Learning doesn't stop on weekends! 🎯",
    condition: async (userId: string) => {
      const weekendProgress = await prisma.$queryRaw`
        SELECT DISTINCT EXTRACT(DOW FROM p."createdAt") as day_of_week
        FROM "Progress" p
        JOIN "Enrollment" e ON p."enrollmentId" = e.id
        WHERE e."userId" = ${userId}
        AND p.completed = true
        AND EXTRACT(DOW FROM p."createdAt") IN (0, 6)
      `;
      return Array.isArray(weekendProgress) && weekendProgress.length >= 2;
    }
  }
]; 