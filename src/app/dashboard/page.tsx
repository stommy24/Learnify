import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import XPProgress from '@/components/dashboard/XPProgress';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import AchievementsList from '@/components/achievements/AchievementsList';
import AchievementStats from '@/components/achievements/AchievementStats';
import AchievementLeaderboard from '@/components/achievements/AchievementLeaderboard';
import LearningStats from '@/components/dashboard/LearningStats';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { addDays, format } from 'date-fns';

interface AchievementData {
  id: string;
  type: string;
  name: string;
  description: string;
  xpReward: number;
  unlockedAt: Date | null;
  progress: number;
}

interface CourseWithProgress {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  published: boolean;
  authorId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  lessons: number;
  _count: {
    sections: number;
  };
  enrollments: Array<{
    id: string;
    userId: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    progress: Array<{
      id: string;
      enrollmentId: string;
      lessonId: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Fetch student profile
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id }
  });

  // Fetch weekly stats for the last 7 days
  const weeklyStats = await Promise.all(
    Array.from({ length: 7 }, async (_, i) => {
      const date = addDays(new Date(), -i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const dailyProgress = await prisma.progress.findMany({
        where: {
          enrollment: { userId: session.user.id },
          completed: true,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      return {
        date: format(date, 'yyyy-MM-dd'),
        lessonsCompleted: dailyProgress.length,
        minutesSpent: dailyProgress.length * 15 // Assuming average of 15 minutes per lesson
      };
    })
  );

  // Fetch enrolled courses with progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          _count: {
            select: {
              sections: true
            }
          },
          enrollments: {
            include: {
              progress: true
            }
          }
        }
      },
      progress: true
    }
  });

  const coursesWithProgress: CourseWithProgress[] = enrollments.map(enrollment => ({
    ...enrollment.course,
    progress: enrollment.progress.filter(p => p.completed).length,
    lessons: enrollment.progress.length,
    _count: enrollment.course._count,
    enrollments: enrollment.course.enrollments
  }));

  const unlockedAchievements = await prisma.$queryRaw<AchievementData[]>`
    SELECT 
      a.id,
      a.type,
      a.name,
      a.description,
      a."xpReward",
      ua."unlockedAt",
      CASE 
        WHEN ua.id IS NOT NULL THEN 100
        ELSE 0
      END as progress
    FROM "Achievement" a
    LEFT JOIN "UserAchievement" ua 
    ON a.id = ua."achievementId" 
    AND ua."userId" = ${session.user.id}
  `;

  const achievements = unlockedAchievements.map(achievement => ({
    ...achievement,
    category: achievement.type,
    shareMessage: ACHIEVEMENTS.find(a => a.type === achievement.type)?.shareMessage || '',
    unlockedAt: achievement.unlockedAt || undefined
  }));

  const leaderboardData = await prisma.$queryRaw`
    SELECT 
      u.id,
      u.name,
      u."avatarId",
      sp."xpPoints",
      COUNT(ua.id) as "achievementCount"
    FROM "User" u
    LEFT JOIN "StudentProfile" sp ON u.id = sp."userId"
    LEFT JOIN "UserAchievement" ua ON u.id = ua."userId"
    GROUP BY u.id, u.name, u."avatarId", sp."xpPoints"
    ORDER BY "achievementCount" DESC, sp."xpPoints" DESC
    LIMIT 10
  `;

  const formattedLeaderboard = (leaderboardData as any[]).map((entry, index) => ({
    userId: entry.id,
    username: entry.name || 'Anonymous User',
    avatarUrl: entry.avatarId ? `/avatars/${entry.avatarId}.png` : undefined,
    totalAchievements: Number(entry.achievementCount),
    totalXP: entry.xpPoints || 0,
    rank: index + 1
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
      <div className="grid gap-8">
        <XPProgress 
          xp={studentProfile?.xpPoints ?? 0} 
          level={String(Math.floor((studentProfile?.xpPoints ?? 0) / 1000) + 1)}
        />

        <LearningStats weeklyProgress={weeklyStats} />
        
        <ProgressOverview courses={coursesWithProgress} />
        
        <div className="grid md:grid-cols-2 gap-8">
          <AchievementsList achievements={achievements} />
          <AchievementStats achievements={achievements} />
        </div>
        
        <AchievementLeaderboard 
          entries={formattedLeaderboard}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
} 
