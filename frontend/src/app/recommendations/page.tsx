'use client';

import { Header } from '@/components/layout/Header';
import { RecommendationCard } from '@/components/recommendation/RecommendationCard';
import { RecommendationCardSkeleton } from '@/components/ui/Skeleton';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useRouter } from 'next/navigation';

export default function RecommendationsPage() {
  const router = useRouter();
  const { recommendations, loading, error } = useRecommendations();

  const handleViewCourse = (id: number) => {
    router.push(`/courses/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">추천 코스</h1>
          <p className="text-gray-600">당신에게 맞는 드라이빙 코스를 추천해드립니다</p>
        </div>

        {/* 추천 카테고리 그리드 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <RecommendationCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">⚠️ 추천 데이터를 불러오는데 실패했습니다</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              다시 시도
            </button>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                recommendationId={recommendation.id}
                onViewCourse={handleViewCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">추천 데이터가 없습니다.</div>
            <div className="text-sm text-gray-400">잠시 후 다시 시도해보세요.</div>
          </div>
        )}

        {/* 추천 시스템 설명 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">추천 시스템이란?</h2>
          <div className="text-gray-600 space-y-2">
            <p>
              우리의 추천 시스템은 드라이빙 스타일, 경험 수준, 선호하는 경관 등을 고려하여 
              최적의 와인딩 코스를 제안합니다.
            </p>
            <p>
              각 카테고리는 특정한 드라이빙 목적이나 선호도를 반영하여 구성되었으며, 
              코스의 특성과 난이도를 종합적으로 고려합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 