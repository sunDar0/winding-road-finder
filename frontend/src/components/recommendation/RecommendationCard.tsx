import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Recommendation } from '@/types/recommendation';
import { useRouter } from 'next/navigation';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onViewCourse: (id: number) => void;
  recommendationId: number;
}

export function RecommendationCard({ recommendation, onViewCourse, recommendationId }: RecommendationCardProps) {
  const router = useRouter();

  const handleViewDetail = () => {
    router.push(`/recommendations/${recommendationId}`);
  };

  return (
    <div className="cursor-pointer" onClick={handleViewDetail}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
          <p className="text-gray-600 text-sm">{recommendation.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {recommendation.courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                  onViewCourse(course.id);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{course.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">{course.region}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      {Math.round((course.ratings.tech + course.ratings.speed + course.ratings.scenery + course.ratings.road + course.ratings.access) / 5)}
                    </div>
                    <div className="text-xs text-gray-500">평점</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {course.styles.slice(0, 2).map((style, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {recommendation.courses.length > 3 && (
            <div className="text-center text-sm text-gray-500 mb-4">
              +{recommendation.courses.length - 3}개 더 보기
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
              handleViewDetail();
            }}
          >
            상세 보기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 