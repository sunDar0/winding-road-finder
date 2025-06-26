'use client';

import { CourseGrid } from '@/components/course/CourseGrid';
import { AdvancedFilter } from '@/components/filter/AdvancedFilter';
import { FilterChips } from '@/components/filter/FilterChips';
import { Header } from '@/components/layout/Header';
import { useAdvancedCourses } from '@/hooks/useAdvancedCourses';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RatingRange {
  min: number;
  max: number;
}

interface AdvancedFilters {
  region: string;
  style: string;
  search: string;
  ratingRange: RatingRange;
}

export default function CoursesPage() {
  const router = useRouter();
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filters, setFilters] = useState<AdvancedFilters>({
    region: '',
    style: '',
    search: '',
    ratingRange: { min: 0, max: 10 }
  });

  const { filteredCourses, loading, error } = useAdvancedCourses(filters);

  const handleViewDetail = (id: number) => {
    router.push(`/courses/${id}`);
  };

  const handleFilterChange = (key: keyof AdvancedFilters, value: string | RatingRange) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilter = (key: keyof AdvancedFilters) => {
    if (key === 'ratingRange') {
      setFilters(prev => ({ ...prev, ratingRange: { min: 0, max: 10 } }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '' }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      region: '',
      style: '',
      search: '',
      ratingRange: { min: 0, max: 10 }
    });
  };

  const handleAdvancedFilterApply = (advancedFilters: AdvancedFilters) => {
    setFilters(advancedFilters);
    setShowAdvancedFilter(false);
  };

  const handleAdvancedFilterReset = () => {
    clearAllFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">코스 목록</h1>
          <p className="text-gray-600">원하는 드라이빙 코스를 찾아보세요</p>
        </div>

        {/* 기본 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">필터</h2>
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
            >
              {showAdvancedFilter ? '기본 필터' : '고급 필터'}
            </button>
          </div>
          
          {!showAdvancedFilter ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 지역</option>
                  <option value="서울특별시">서울특별시</option>
                  <option value="인천광역시">인천광역시</option>
                  <option value="경기도">경기도</option>
                  <option value="강원도">강원도</option>
                  <option value="충청북도">충청북도</option>
                  <option value="충청남도">충청남도</option>
                  <option value="전라북도">전라북도</option>
                  <option value="전라남도">전라남도</option>
                  <option value="광주광역시">광주광역시</option>
                  <option value="경상북도">경상북도</option>
                  <option value="경상남도">경상남도</option>
                  <option value="부산광역시">부산광역시</option>
                  <option value="제주도">제주도</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  스타일
                </label>
                <select
                  value={filters.style}
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체 스타일</option>
                  <option value="헤어핀">헤어핀</option>
                  <option value="고속">고속</option>
                  <option value="경관">경관</option>
                  <option value="입문">입문</option>
                  <option value="투어">투어</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  검색어
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="코스명, 설명, 지역 검색..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          ) : (
            <AdvancedFilter
              onApplyFilters={handleAdvancedFilterApply}
              onReset={handleAdvancedFilterReset}
            />
          )}
        </div>

        {/* 필터 칩 */}
        <FilterChips
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={clearAllFilters}
        />

        {/* 결과 카운트 */}
        <div className="mb-6">
          <p className="text-gray-600">
            검색 결과: <span className="font-semibold">{filteredCourses.length}</span>개 코스
          </p>
        </div>

        {/* 코스 그리드 */}
        <CourseGrid
          courses={filteredCourses}
          loading={loading}
          error={error}
          onViewDetail={handleViewDetail}
        />
      </main>
    </div>
  );
} 