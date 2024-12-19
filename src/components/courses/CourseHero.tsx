'use client';

import Image from 'next/image';
import { Course, Section, Lesson } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type CourseWithRelations = Course & {
  author: {
    name: string | null;
  };
  sections: (Section & {
    lessons: Lesson[];
  })[];
};

interface CourseHeroProps {
  course: CourseWithRelations;
  isEnrolled: boolean;
}

export default function CourseHero({ course, isEnrolled }: CourseHeroProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to enroll');
      }

      toast.success('Successfully enrolled in course!');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative py-16 bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-white">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg mb-6">{course.description}</p>
          <div className="flex items-center gap-4 mb-8">
            <span>Created by {course.author.name}</span>
            <span>•</span>
            <span>{course.sections.reduce((acc, section) => acc + section.lessons.length, 0)} lessons</span>
          </div>
          <button
            onClick={isEnrolled ? () => router.push(`/courses/${course.id}/learn`) : handleEnroll}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-semibold ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isEnrolled
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
          >
            {isLoading ? 'Loading...' : isEnrolled ? 'Continue Learning' : 'Enroll Now'}
          </button>
        </div>
        {course.imageUrl && (
          <div className="flex-1 relative h-64 md:h-96">
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
} 