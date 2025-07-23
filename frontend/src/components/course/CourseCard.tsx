import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  const getAverageRating = () => {
    const ratings = Object.values(course.ratings);
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
  };

  const getRatingColor = (rating: string) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'text-green-600';
    if (num >= 4.0) return 'text-blue-600';
    if (num >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

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
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{course.region}</p>
              <p className="text-sm text-gray-700 line-clamp-2">{course.tagline}</p>
            </div>
            <div className={`text-2xl font-bold ${getRatingColor(getAverageRating())} ml-4`}>
              {getAverageRating()}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 지도 썸네일 */}
          {course.thumbnailImage ? (
            <div className="mb-4">
              <img 
                src={`http://localhost:8080${course.thumbnailImage}`}
                alt={`${course.name} 코스 경로`}
                className="w-full h-48 aspect-square object-cover rounded-lg border border-gray-200"
                loading="lazy"
                onError={(e) => {
                  console.error('썸네일 이미지 로드 실패:', course.thumbnailImage);
                  // 이미지 로드 실패 시 플레이스홀더 표시
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              {/* 이미지 로드 실패 시 플레이스홀더 */}
              <div className="hidden h-48 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-xs">경로 정보 없음</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 h-48 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-xs">경로 정보 없음</p>
              </div>
            </div>
          )}

          {/* 드라이빙 스타일 태그 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {course.styles.map((style, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {style}
              </span>
            ))}
          </div>

          {/* 경로점 정보 */}
          {course.nav && course.nav.length > 0 && (
            <div className="text-xs text-gray-600">
              <div className="flex items-center mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>{course.nav[0].name}</span>
              </div>
              {course.nav.length > 2 && (
                <div className="flex items-center mb-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>{course.nav[1].name}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>{course.nav[course.nav.length - 1].name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 