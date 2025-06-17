package query

import (
	"github.com/sunDar0/winding-road-finder/backend/domain/course"
	"github.com/sunDar0/winding-road-finder/backend/domain/recommendation"
)

// RecommendationWithCourses는 추천 카테고리와 코스 상세정보 집합을 나타냅니다.
type RecommendationWithCourses struct {
	Title       string
	Description string
	Courses     []*course.CourseAggregate
}

// RecommendationQueryService는 추천+코스 상세정보 조합을 담당합니다.
type RecommendationQueryService struct {
	recRepo    recommendation.RecommendationRepository
	courseRepo course.CourseQueryRepository
}

func NewRecommendationQueryService(recRepo recommendation.RecommendationRepository, courseRepo course.CourseQueryRepository) *RecommendationQueryService {
	return &RecommendationQueryService{recRepo: recRepo, courseRepo: courseRepo}
}

// GetRecommendationsWithCourses는 추천 카테고리별로 코스 상세정보를 포함해 반환합니다.
func (svc *RecommendationQueryService) GetRecommendationsWithCourses() ([]*RecommendationWithCourses, error) {
	recs, err := svc.recRepo.FindAll()
	if err != nil {
		return nil, err
	}
	var result []*RecommendationWithCourses
	for _, rec := range recs {
		var courses []*course.CourseAggregate
		for _, cid := range rec.CourseIds {
			c, err := svc.courseRepo.FindByID(cid)
			if err != nil {
				return nil, err
			}
			if c != nil {
				courses = append(courses, c)
			}
		}
		result = append(result, &RecommendationWithCourses{
			Title:       rec.Title,
			Description: rec.Description,
			Courses:     courses,
		})
	}
	return result, nil
}

func (svc *RecommendationQueryService) GetRecommendationById(id int) (*RecommendationWithCourses, error) {
	rec, err := svc.recRepo.FindById(id)
	if err != nil {
		return nil, err
	}
	
	var courses []*course.CourseAggregate
		for _, cid := range rec.CourseIds {
			c, err := svc.courseRepo.FindByID(cid)
			if err != nil {
				return nil, err
			}
			if c != nil {
				courses = append(courses, c)
			}
		}
		
	return &RecommendationWithCourses{
		Title:       rec.Title,
		Description: rec.Description,
		Courses:     courses,
	}, nil
} 