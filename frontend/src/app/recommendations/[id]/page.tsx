'use client';

import { CourseCard } from '@/components/course/CourseCard';
import { Header } from '@/components/layout/Header';
import { api } from '@/lib/api';
import { Recommendation } from '@/types/recommendation';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecommendationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recommendationId = Number(params.id);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.recommendations.getById(recommendationId);
        setRecommendation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '추천 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (recommendationId) {
      fetchRecommendation();
    }
  }, [recommendationId]);

  const handleViewCourse = (id: number) => {
    router.push(`/courses/${id}`);
  };

  const handleBack = () => {
    router.push('/recommendations');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-16 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded"></div>
              ))}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ 오류가 발생했습니다</div>
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

  if (!recommendation || !recommendation.courses) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-600 mb-4">추천 정보를 찾을 수 없습니다</div>
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

  const averageRating = recommendation.courses.length > 0 
    ? Math.round(
        recommendation.courses.reduce((sum, course) => 
          sum + (course.ratings.tech + course.ratings.speed + course.ratings.scenery + course.ratings.road + course.ratings.access) / 5, 0
        ) / recommendation.courses.length
      )
    : 0;

  const uniqueRegions = new Set(recommendation.courses.map(course => course.region)).size;
  const uniqueStyles = new Set(recommendation.courses.flatMap(course => course.styles)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          추천 목록으로 돌아가기
        </button>

        {/* 추천 카테고리 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{recommendation.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{recommendation.description}</p>
          
          {/* 추천 카테고리 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{recommendation.courses.length}</div>
              <div className="text-sm text-gray-500">추천 코스</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageRating}</div>
              <div className="text-sm text-gray-500">평균 평점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{uniqueRegions}</div>
              <div className="text-sm text-gray-500">지역 수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{uniqueStyles}</div>
              <div className="text-sm text-gray-500">스타일 수</div>
            </div>
          </div>
        </div>

        {/* 코스 목록 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 코스 목록</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendation.courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleViewCourse(course.id)}
              />
            ))}
          </div>
        </div>

        {/* 추천 이유 및 팁 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">이 추천을 선택한 이유</h3>
          <div className="text-gray-600 space-y-3">
            <p>
              이 카테고리는 특정한 드라이빙 목적이나 선호도를 반영하여 구성되었습니다. 
              각 코스는 신중하게 선별되어 최적의 드라이빙 경험을 제공합니다.
            </p>
            <p>
              <strong>추천 팁:</strong> 코스를 방문하기 전에 날씨와 도로 상황을 확인하시고, 
              안전한 드라이빙을 위해 적절한 속도를 유지하시기 바랍니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 