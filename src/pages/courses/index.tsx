import { MainLayout } from '@/components/layout/MainLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { SearchBar } from '@/components/ui/SearchBar';

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: "Mathematics Fundamentals",
      description: "Master basic math concepts through interactive lessons",
      progress: 45,
      image: "/images/math.jpg"
    },
    // Add more courses...
  ];

  return (
    <MainLayout title="Courses">
      <div className="space-y-6">
        <SearchBar className="max-w-2xl mx-auto" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 