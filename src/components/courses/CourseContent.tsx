import { Section, Lesson } from '@prisma/client';
import { Lock, PlayCircle, CheckCircle } from 'lucide-react';

interface CourseContentProps {
  sections: (Section & {
    lessons: Lesson[];
  })[];
  isEnrolled: boolean;
}

export default function CourseContent({ sections, isEnrolled }: CourseContentProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Course Content</h2>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4">
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <div className="divide-y">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {isEnrolled ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                  <PlayCircle className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 