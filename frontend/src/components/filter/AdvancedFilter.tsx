import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useState } from 'react';

interface RatingRange {
  min: number;
  max: number;
}

interface AdvancedFilterProps {
  onApplyFilters: (filters: {
    region: string;
    style: string;
    search: string;
    ratingRange: RatingRange;
  }) => void;
  onReset: () => void;
}

export function AdvancedFilter({ onApplyFilters, onReset }: AdvancedFilterProps) {
  const [filters, setFilters] = useState({
    region: '',
    style: '',
    search: '',
    ratingRange: { min: 0, max: 10 }
  });

  const handleFilterChange = (key: string, value: string | number) => {
    if (key === 'ratingMin' || key === 'ratingMax') {
      setFilters(prev => ({
        ...prev,
        ratingRange: {
          ...prev.ratingRange,
          [key === 'ratingMin' ? 'min' : 'max']: Number(value)
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      region: '',
      style: '',
      search: '',
      ratingRange: { min: 0, max: 10 }
    });
    onReset();
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">고급 필터</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 지역 필터 */}
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
              <option value="강원도">강원도</option>
              <option value="경기도">경기도</option>
              <option value="경상북도">경상북도</option>
              <option value="경상남도">경상남도</option>
              <option value="전라북도">전라북도</option>
              <option value="전라남도">전라남도</option>
              <option value="충청북도">충청북도</option>
              <option value="충청남도">충청남도</option>
              <option value="제주도">제주도</option>
            </select>
          </div>

          {/* 스타일 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              드라이빙 스타일
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

          {/* 검색어 필터 */}
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

          {/* 평점 범위 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평균 평점 범위
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={filters.ratingRange.min}
                onChange={(e) => handleFilterChange('ratingMin', e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">~</span>
              <input
                type="number"
                min="0"
                max="10"
                value={filters.ratingRange.max}
                onChange={(e) => handleFilterChange('ratingMax', e.target.value)}
                className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApply} className="flex-1">
              필터 적용
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1">
              초기화
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 