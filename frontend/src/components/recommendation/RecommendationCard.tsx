import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Recommendation } from '@/types/recommendation';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick: () => void;
}

export function RecommendationCard({ recommendation, onClick }: RecommendationCardProps) {
  return (
    <div 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                {recommendation.title}
              </h3>
              <p className="text-sm text-gray-700 line-clamp-2">{recommendation.description}</p>
            </div>
            <div className="text-sm text-gray-500 ml-4">
              {recommendation.courses.length}개 코스
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 빈 이미지 영역 */}
          <div className="mb-4 h-48 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-xs">추천 코스</p>
            </div>
          </div>

          {/* 포함된 코스 목록 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">포함된 코스:</h4>
            <div className="space-y-1">
              {recommendation.courses.slice(0, 3).map((course, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  <span className="line-clamp-1">{course.name}</span>
                </div>
              ))}
              {recommendation.courses.length > 3 && (
                <div className="text-xs text-gray-500">
                  외 {recommendation.courses.length - 3}개 코스
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 