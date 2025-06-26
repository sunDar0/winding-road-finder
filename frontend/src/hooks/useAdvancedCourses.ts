import { api } from "@/lib/api";
import { Course, CourseFilters } from "@/types/course";
import { useEffect, useMemo, useState } from "react";

interface RatingRange {
  min: number;
  max: number;
}

interface AdvancedFilters extends CourseFilters {
  ratingRange: RatingRange;
}

interface UseAdvancedCoursesReturn {
  courses: Course[];
  filteredCourses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdvancedCourses(
  filters?: AdvancedFilters
): UseAdvancedCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.courses.getAll({
        region: filters?.region || "",
        style: filters?.style || "",
        search: filters?.search || "",
      });
      setCourses(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters?.region, filters?.style, filters?.search]);

  // 평점 범위 필터링을 클라이언트 사이드에서 처리
  const filteredCourses = useMemo(() => {
    if (!courses || courses.length === 0) {
      return [];
    }

    if (
      !filters?.ratingRange ||
      (filters.ratingRange.min === 0 && filters.ratingRange.max === 10)
    ) {
      return courses;
    }

    return courses.filter((course) => {
      const { tech, speed, scenery, road, access } = course.ratings;
      const averageRating = (tech + speed + scenery + road + access) / 5;

      return (
        averageRating >= filters.ratingRange.min &&
        averageRating <= filters.ratingRange.max
      );
    });
  }, [courses, filters?.ratingRange]);

  return {
    courses,
    filteredCourses,
    loading,
    error,
    refetch: fetchCourses,
  };
}
