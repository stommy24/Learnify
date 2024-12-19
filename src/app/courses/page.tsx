import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import CourseCard from '@/components/courses/CourseCard';
import CategoryFilter from '@/components/courses/CategoryFilter';

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

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  
  const courses = await prisma.course.findMany({
    where: {
      published: true
    },
    include: {
      author: {
        select: {
          name: true,
        }
      },
      category: true,
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  }) as CourseWithRelations[];

  const categories = await prisma.category.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      <div className="mb-8">
        <CategoryFilter categories={categories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id}
            course={course}
            isEnrolled={false}
          />
        ))}
      </div>
    </div>
  );
}