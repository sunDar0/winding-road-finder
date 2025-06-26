import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onViewDetail: (id: number) => void;
}

export function CourseCard({ course, onViewDetail }: CourseCardProps) {
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
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
            <p className="text-sm text-gray-600">{course.region}</p>
          </div>
          <div className={`text-2xl font-bold ${getRatingColor(getAverageRating())}`}>
            {getAverageRating()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3 line-clamp-2">{course.tagline}</p>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">특성:</div>
          <div className="flex flex-wrap gap-1">
            {course.styles.map((style, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 text-xs mb-4">
          <div className="text-center">
            <div className="font-medium">기술</div>
            <div className={getRatingColor(course.ratings.tech)}>{course.ratings.tech}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">속도</div>
            <div className={getRatingColor(course.ratings.speed)}>{course.ratings.speed}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">경관</div>
            <div className={getRatingColor(course.ratings.scenery)}>{course.ratings.scenery}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">도로</div>
            <div className={getRatingColor(course.ratings.road)}>{course.ratings.road}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">접근</div>
            <div className={getRatingColor(course.ratings.access)}>{course.ratings.access}</div>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={() => onViewDetail(course.id)}
        >
          상세 보기
        </Button>
      </CardContent>
    </Card>
  );
} 