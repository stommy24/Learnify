'use client';

import { Course, Section, Lesson, Progress } from '@prisma/client';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type CourseWithSections = Course & {
  sections: (Section & {
    lessons: Lesson[];
  })[];
};

interface CourseSidebarProps {
  course: CourseWithSections;
  progress: Progress[];
}

export default function CourseSidebar({ course, progress }: CourseSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p) => p.lessonId === lessonId && p.completed);
  };

  return (
    <div className="h-full w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{course.title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {course.sections.map((section) => (
          <div key={section.id}>
            <div className="p-4 bg-gray-50 font-medium">
              {section.title}
            </div>
            <div>
              {section.lessons.map((lesson) => {
                const isCompleted = isLessonCompleted(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => router.push(`/courses/${course.id}/learn/${lesson.id}`)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 ${
                      pathname.includes(lesson.id) ? 'bg-gray-50' : ''
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-gray-500" />
                    )}
                    <span className="text-sm">{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 