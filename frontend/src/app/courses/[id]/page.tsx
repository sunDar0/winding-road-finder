'use client';

import { CourseDetail } from '@/components/course/CourseDetail';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { Course } from '@/types/course';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = Number(params.id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.courses.getById(courseId);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleBack = () => {
    router.push('/courses');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* 뒤로가기 버튼 스켈레톤 */}
            <Skeleton className="h-10 w-32" />
            
            {/* 제목 스켈레톤 */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            {/* 태그라인 스켈레톤 */}
            <Skeleton className="h-6 w-full" />
            
            {/* 특성 스켈레톤 */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            
            {/* 평점 스켈레톤 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-8 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* 설명 스켈레톤 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            
            {/* 내비게이션 스켈레톤 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ 코스 정보를 불러오는데 실패했습니다</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-4">코스를 찾을 수 없습니다</div>
            <div className="text-sm text-gray-400 mb-4">요청하신 코스가 존재하지 않거나 삭제되었을 수 있습니다.</div>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseDetail course={course} onBack={handleBack} />
      </main>
    </div>
  );
} 