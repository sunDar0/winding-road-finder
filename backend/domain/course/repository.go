package course

// CourseQueryRepository는 코스 목록/상세 조회를 담당하는 인터페이스입니다.
type CourseQueryRepository interface {
	FindAll(region, style, search string) ([]*CourseAggregate, error)
	FindByID(id int) (*CourseAggregate, error)
} 