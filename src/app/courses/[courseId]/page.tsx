import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import CourseHero from '@/components/courses/CourseHero';
import CourseContent from '@/components/courses/CourseContent';

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions);
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      sections: {
        include: {
          lessons: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = session?.user ? await prisma.enrollment.findFirst({
    where: {
      courseId: course.id,
      userId: session.user.id,
    },
  }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CourseHero course={course} isEnrolled={!!isEnrolled} />
      <CourseContent sections={course.sections} isEnrolled={!!isEnrolled} />
    </div>
  );
} 