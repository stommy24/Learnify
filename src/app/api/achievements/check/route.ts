import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { checkAchievements } from "@/lib/achievementChecker";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unlockedAchievements = await checkAchievements(session.user.id);

    return NextResponse.json(unlockedAchievements);
  } catch (error) {
    console.error("[ACHIEVEMENT_CHECK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 