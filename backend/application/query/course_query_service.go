package query

import "github.com/sunDar0/winding-road-finder/backend/domain/course"

// CourseQueryService는 코스 목록/상세 조회 비즈니스 로직을 담당합니다.
type CourseQueryService struct {
	repo course.CourseQueryRepository
}

func NewCourseQueryService(repo course.CourseQueryRepository) *CourseQueryService {
	return &CourseQueryService{repo: repo}
}

func (svc *CourseQueryService) GetCourses(region, style, search string) ([]*course.CourseAggregate, error) {
	return svc.repo.FindAll(region, style, search)
}

func (svc *CourseQueryService) GetCourseByID(id int) (*course.CourseAggregate, error) {
	return svc.repo.FindByID(id)
} 

