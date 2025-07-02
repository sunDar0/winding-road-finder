import { CourseRouteMap } from '@/components/map/CourseRouteMap';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Course } from '@/types/course';
import { useState } from 'react';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
  const [showAllRatings, setShowAllRatings] = useState(false);

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

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return '매우 좋음';
    if (rating >= 4.0) return '좋음';
    if (rating >= 3.5) return '보통';
    if (rating >= 3.0) return '나쁨';
    return '매우 나쁨';
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button variant="outline" onClick={onBack}>
        ← 뒤로가기
      </Button>

      {/* 코스 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{course.region}</p>
              <p className="text-gray-700">{course.tagline}</p>
            </div>
            <div className={`text-4xl font-bold ${getRatingColor(getAverageRating())}`}>
              {getAverageRating()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6">{course.characteristics}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">드라이빙 스타일</h3>
            <div className="flex flex-wrap gap-2">
              {course.styles.map((style, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 코스 경로 지도 */}
      <Card>
        <CardContent>
          <CourseRouteMap 
            navPoints={course.nav} 
            courseName={course.name}
            naverMapUrl={course.naverMapUrl}
          />
        </CardContent>
      </Card>

      {/* 평점 상세 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">평점 상세</h2>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(course.ratings).map(([key, rating]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 capitalize">
                    {key === 'tech' && '기술성'}
                    {key === 'speed' && '스피드'}
                    {key === 'scenery' && '경관'}
                    {key === 'road' && '도로 상태'}
                    {key === 'access' && '접근성'}
                  </span>
                  <span className={`font-bold ${getRatingColor(rating.toString())}`}>
                    {rating}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(rating / 5) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{getRatingLabel(rating)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 추가 정보 */}
      {course.notes && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">추가 정보</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{course.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 