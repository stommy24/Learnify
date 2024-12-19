import Image from 'next/image';
import Link from 'next/link';

type CourseWithRelations = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  price: number;
  published: boolean;
  authorId: string;
  categoryId: string;
  author: {
    name: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  _count: {
    enrollments: number;
  };
};

interface CourseCardProps {
  course: CourseWithRelations;
  isEnrolled: boolean;
}

export default function CourseCard({ course, isEnrolled }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-blue-600 font-medium">
            {course.category.name}
          </span>
          <span className="text-sm text-gray-500">
            {course._count.enrollments} enrolled
          </span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">
            By {course.author.name || 'Unknown'}
          </span>
          <Link
            href={`/courses/${course.id}`}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isEnrolled
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
          </Link>
        </div>
      </div>
    </div>
  );
} 