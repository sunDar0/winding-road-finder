import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Course } from '@/types/course';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAverageRating = () => {
    const { tech, speed, scenery, road, access } = course.ratings;
    return Math.round((tech + speed + scenery + road + access) / 5);
  };

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button variant="outline" onClick={onBack}>
        ← 목록으로 돌아가기
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

      {/* 평점 상세 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">상세 평점</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">기술적 난이도</div>
              <div className={`text-2xl font-bold ${getRatingColor(course.ratings.tech)}`}>
                {course.ratings.tech}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">속도감</div>
              <div className={`text-2xl font-bold ${getRatingColor(course.ratings.speed)}`}>
                {course.ratings.speed}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">경관</div>
              <div className={`text-2xl font-bold ${getRatingColor(course.ratings.scenery)}`}>
                {course.ratings.scenery}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">도로 상태</div>
              <div className={`text-2xl font-bold ${getRatingColor(course.ratings.road)}`}>
                {course.ratings.road}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">접근성</div>
              <div className={`text-2xl font-bold ${getRatingColor(course.ratings.access)}`}>
                {course.ratings.access}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 내비게이션 정보 */}
      {course.nav && course.nav.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">내비게이션 경로</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.nav.map((nav, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{nav.name}</div>
                    <div className="text-sm text-gray-600">{nav.type}</div>
                    <div className="text-xs text-gray-500">
                      {nav.geolocation.latitude.toFixed(6)}, {nav.geolocation.longitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 추가 정보 */}
      {course.notes && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">추가 정보</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{course.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 