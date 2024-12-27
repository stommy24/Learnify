'use client';

import { Enrollment, Progress } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface CourseVideoPlayerProps {
  courseId: string;
  enrollment: Enrollment & {
    progress: Progress[];
  };
}

export default function CourseVideoPlayer({ 
  courseId,
  enrollment 
}: CourseVideoPlayerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const completeLesson = async (lessonId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to complete lesson');
      }

      toast.success('Progress saved!');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <span className="text-white">Video Player Placeholder</span>
      </div>
      <div className="mt-4">
        <button
          onClick={() => completeLesson('lesson-id')}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
} 
