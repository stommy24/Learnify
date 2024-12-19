import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'weekly';

    let dateFilter: Date | null = null;
    if (timeframe === 'weekly') {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'monthly') {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereClause = dateFilter 
      ? Prisma.sql`WHERE ua."unlockedAt" >= ${dateFilter}`
      : Prisma.empty;

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
      ${whereClause}
      GROUP BY u.id, u.name, u."avatarId", sp."xpPoints"
      ORDER BY "achievementCount" DESC, sp."xpPoints" DESC
      LIMIT 100
    `;

    const formattedLeaderboard = (leaderboardData as any[]).map((entry, index) => ({
      userId: entry.id,
      username: entry.name || 'Anonymous User',
      avatarUrl: entry.avatarId ? `/avatars/${entry.avatarId}.png` : undefined,
      totalAchievements: Number(entry.achievementCount),
      totalXP: entry.xpPoints || 0,
      rank: index + 1
    }));

    return NextResponse.json(formattedLeaderboard);
  } catch (error) {
    console.error("[ACHIEVEMENT_LEADERBOARD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 