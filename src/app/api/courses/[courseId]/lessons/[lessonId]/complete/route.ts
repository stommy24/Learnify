import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: params.courseId,
        userId: session.user.id,
      },
    });

    if (!enrollment) {
      return new NextResponse("Not enrolled", { status: 403 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        id: `${enrollment.id}_${params.lessonId}`,
      },
      update: {
        completed: true,
      },
      create: {
        id: `${enrollment.id}_${params.lessonId}`,
        enrollmentId: enrollment.id,
        lessonId: params.lessonId,
        completed: true,
      },
    });

    // Update XP points
    await prisma.studentProfile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        xpPoints: {
          increment: 10,
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[LESSON_COMPLETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 