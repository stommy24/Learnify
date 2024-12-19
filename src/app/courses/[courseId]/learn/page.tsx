import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import CourseSidebar from '@/components/courses/CourseSidebar';
import CourseVideoPlayer from '@/components/courses/CourseVideoPlayer';

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function LearnPage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
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

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: course.id,
      userId: session.user.id,
    },
    include: {
      progress: true,
    },
  });

  if (!enrollment) {
    redirect(`/courses/${course.id}`);
  }

  return (
    <div className="h-screen flex">
      <CourseSidebar 
        course={course}
        progress={enrollment.progress}
      />
      <CourseVideoPlayer 
        courseId={course.id}
        enrollment={enrollment}
      />
    </div>
  );
} 