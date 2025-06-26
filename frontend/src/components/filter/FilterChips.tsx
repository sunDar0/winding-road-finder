import { CourseFilters } from '@/types/course';

interface RatingRange {
  min: number;
  max: number;
}

interface AdvancedFilters extends CourseFilters {
  ratingRange: RatingRange;
}

interface FilterChipsProps {
  filters: AdvancedFilters;
  onRemoveFilter: (key: keyof AdvancedFilters) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  const getActiveFilters = () => {
    const activeFilters: Array<{ key: string; value: string; label: string }> = [];
    
    if (filters.region) {
      activeFilters.push({ key: 'region', value: filters.region, label: `지역: ${filters.region}` });
    }
    
    if (filters.style) {
      activeFilters.push({ key: 'style', value: filters.style, label: `스타일: ${filters.style}` });
    }
    
    if (filters.search) {
      activeFilters.push({ key: 'search', value: filters.search, label: `검색어: ${filters.search}` });
    }
    
    // ratingRange가 기본값이 아닌 경우에만 표시
    if (filters.ratingRange && (filters.ratingRange.min > 0 || filters.ratingRange.max < 10)) {
      activeFilters.push({ 
        key: 'ratingRange', 
        value: `${filters.ratingRange.min}-${filters.ratingRange.max}`, 
        label: `평점: ${filters.ratingRange.min}~${filters.ratingRange.max}` 
      });
    }
    
    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700">적용된 필터:</span>
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
        >
          모두 제거
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            <span>{label}</span>
            <button
              onClick={() => onRemoveFilter(key as keyof AdvancedFilters)}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function getFilterLabel(key: string): string {
  switch (key) {
    case 'region': return '지역';
    case 'style': return '스타일';
    case 'search': return '검색어';
    default: return key;
  }
} 