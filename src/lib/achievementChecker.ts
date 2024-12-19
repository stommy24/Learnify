import { ACHIEVEMENTS } from './achievements';
import { prisma } from './prisma';

export async function checkAchievements(userId: string) {
  const unlockedAchievements = [];

  for (const achievement of ACHIEVEMENTS) {
    // Check if already unlocked
    const existing = await prisma.$queryRaw`
      SELECT * FROM "UserAchievement" ua
      JOIN "Achievement" a ON ua."achievementId" = a.id
      WHERE ua."userId" = ${userId} AND a.type = ${achievement.type}
    `;

    if (!existing || (Array.isArray(existing) && existing.length === 0)) {
      // Check if condition is met
      const isUnlocked = await achievement.condition(userId);
      
      if (isUnlocked) {
        // Create achievement in DB
        const dbAchievement = await prisma.$queryRaw`
          INSERT INTO "Achievement" (id, type, name, description, "xpReward", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), ${achievement.type}, ${achievement.name}, ${achievement.description}, ${achievement.xpReward}, NOW(), NOW())
          ON CONFLICT (type) DO UPDATE SET "updatedAt" = NOW()
          RETURNING *
        `;

        // Unlock for user
        await prisma.$executeRaw`
          INSERT INTO "UserAchievement" ("userId", "achievementId", "unlockedAt")
          VALUES (${userId}, ${(dbAchievement as any)[0].id}, NOW())
        `;

        // Add XP reward
        await prisma.studentProfile.update({
          where: { userId },
          data: {
            xpPoints: {
              increment: achievement.xpReward
            }
          }
        });

        unlockedAchievements.push(achievement);
      }
    }
  }

  return unlockedAchievements;
} 