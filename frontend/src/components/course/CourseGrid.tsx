import { CourseCardSkeleton } from '@/components/ui/Skeleton';
import { Course } from '@/types/course';
import { CourseCard } from './CourseCard';

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  onViewDetail: (id: number) => void;
}

export function CourseGrid({ courses, loading, error, onViewDetail }: CourseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">⚠️ 코스 데이터를 불러오는데 실패했습니다</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">검색 조건에 맞는 코스가 없습니다.</div>
        <div className="text-sm text-gray-400">다른 검색 조건을 시도해보세요.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
} 