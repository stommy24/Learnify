'use client';

import { Course, Enrollment, Progress } from '@prisma/client';
import Link from 'next/link';
import { CheckCircle, Circle } from 'lucide-react';

type CourseWithProgress = Course & {
  _count: {
    sections: number;
  };
  enrollments: (Enrollment & {
    progress: Progress[];
  })[];
};

interface ProgressOverviewProps {
  courses: CourseWithProgress[];
}

export default function ProgressOverview({ courses }: ProgressOverviewProps) {
  const calculateProgress = (course: CourseWithProgress) => {
    const enrollment = course.enrollments[0];
    if (!enrollment) return 0;
    return (enrollment.progress.length / course._count.sections) * 100;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const progress = calculateProgress(course);
          return (
            <Link
              key={course.id}
              href={`/courses/${course.id}/learn`}
              className="block bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <span className="text-blue-600 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="space-y-2">
                {Array.from({ length: course._count.sections }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index < Math.floor(progress / (100 / course._count.sections)) ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className="text-sm text-gray-600">
                      Section {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 