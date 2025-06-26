'use client';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { RecommendationCardSkeleton, StatsCardSkeleton } from '@/components/ui/Skeleton';
import { useCourses } from '@/hooks/useCourses';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { recommendations, loading: recsLoading, error: recsError } = useRecommendations();

  const handleNavigateToCourses = () => {
    router.push('/courses');
  };

  const handleNavigateToRecommendations = () => {
    router.push('/recommendations');
  };

  const handleNavigateToRecommendationDetail = (id: number) => {
    router.push(`/recommendations/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            와인딩 로드 파인더
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            대한민국 최고의 드라이빙 코스를 발견하세요
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" onClick={handleNavigateToCourses}>
              코스 둘러보기
            </Button>
            <Button variant="outline" size="lg" onClick={handleNavigateToRecommendations}>
              추천 받기
            </Button>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {coursesLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {courses?.length || 0}+
                  </div>
                  <div className="text-gray-600">등록된 코스</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {new Set(courses?.map(c => c.region) || []).size}
                  </div>
                  <div className="text-gray-600">지역</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {recommendations?.length || 0}
                  </div>
                  <div className="text-gray-600">추천 카테고리</div>
                </CardContent>
              </Card>
            </>
          )}
        </section>

        {/* 에러 상태 표시 */}
        {(coursesError || recsError) && (
          <section className="mb-8">
            <Card>
              <CardContent className="text-center">
                <div className="text-red-600 mb-2">⚠️ 데이터 로딩 중 오류가 발생했습니다</div>
                <div className="text-sm text-gray-600">
                  {coursesError && <div>코스 데이터: {coursesError}</div>}
                  {recsError && <div>추천 데이터: {recsError}</div>}
                </div>
                <Button 
                  className="mt-4" 
                  onClick={() => window.location.reload()}
                >
                  다시 시도
                </Button>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 추천 코스 섹션 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">추천 코스</h2>
            <Button 
              variant="outline" 
              onClick={handleNavigateToRecommendations}
              className="text-sm"
            >
              전체 보기
            </Button>
          </div>
          
          {recsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <RecommendationCardSkeleton key={index} />
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec) => (
                <div 
                  key={rec.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full"
                  onClick={() => handleNavigateToRecommendationDetail(rec.id)}
                >
                  <Card className="h-full">
                    <div className="p-6 h-full flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{rec.description}</p>
                      <div className="text-sm text-gray-500 mt-auto">
                        포함된 코스: {rec.courses?.length || 0}개
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-500">추천 데이터를 불러올 수 없습니다.</div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* 빠른 액션 섹션 */}
        <section className="mb-12">
          <Card>
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                더 자세히 알아보기
              </h3>
              <p className="text-gray-600 mb-6">
                다양한 기능을 통해 원하는 코스를 찾아보세요
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Button variant="outline" onClick={handleNavigateToCourses}>
                  모든 코스 보기
                </Button>
                <Button variant="outline" onClick={handleNavigateToRecommendations}>
                  추천 시스템 알아보기
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
