'use client';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useCourses } from '@/hooks/useCourses';
import { useRecommendations } from '@/hooks/useRecommendations';

export default function Home() {
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const { recommendations, loading: recsLoading, error: recsError } = useRecommendations();

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
          <div className="flex justify-center space-x-4">
            <Button size="lg">
              코스 둘러보기
            </Button>
            <Button variant="outline" size="lg">
              추천 코스 보기
            </Button>
          </div>
        </section>

        {/* 통계 섹션 - 실제 데이터 연동 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {coursesLoading ? '...' : courses?.length || 0}+
              </div>
              <div className="text-gray-600">등록된 코스</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {coursesLoading ? '...' : new Set(courses?.map(c => c.region) || []).size}
              </div>
              <div className="text-gray-600">지역</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {recsLoading ? '...' : recommendations?.length || 0}
              </div>
              <div className="text-gray-600">추천 카테고리</div>
            </CardContent>
          </Card>
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

        {/* 로딩 상태 표시 */}
        {(coursesLoading || recsLoading) && (
          <section className="mb-8">
            <Card>
              <CardContent className="text-center">
                <div className="text-gray-600">데이터를 불러오는 중...</div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 기능 소개 섹션 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">코스 검색</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                지역, 스타일, 키워드로 원하는 코스를 쉽게 찾아보세요.
              </p>
              <Button>코스 검색하기</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">추천 시스템</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                당신의 취향에 맞는 최적의 코스 조합을 추천해드립니다.
              </p>
              <Button>추천 받기</Button>
            </CardContent>
          </Card>
        </section>

        {/* 실제 추천 데이터 표시 */}
        {recommendations && recommendations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 코스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.slice(0, 3).map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 text-sm">{rec.description}</p>
                    <div className="text-sm text-gray-500">
                      포함된 코스: {rec.courses.length}개
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 안전 수칙 섹션 */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-900">🚨 안전 수칙</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">운전 전</h4>
                  <ul className="space-y-1">
                    <li>• 차량 점검 및 연료 확인</li>
                    <li>• 내비게이션 경로 미리 확인</li>
                    <li>• 날씨 및 도로 상황 체크</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">운전 중</h4>
                  <ul className="space-y-1">
                    <li>• 속도 제한 준수</li>
                    <li>• 안전거리 확보</li>
                    <li>• 피로 시 휴식 취하기</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
