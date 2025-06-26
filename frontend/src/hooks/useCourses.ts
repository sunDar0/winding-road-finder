import { api } from "@/lib/api";
import { Course, CourseFilters } from "@/types/course";
import { useEffect, useState } from "react";

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCourses(filters?: CourseFilters): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.courses.getAll(filters);
      setCourses(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters?.region, filters?.style, filters?.search]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
}
