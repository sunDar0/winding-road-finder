package recommendation

// RecommendationRepository는 추천 목록 조회를 담당하는 인터페이스입니다.
type RecommendationRepository interface {
	FindAll() ([]*Recommendation, error)
	FindById(id int) (*Recommendation, error)
} 