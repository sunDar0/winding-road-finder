package recommendation

// Recommendation은 추천 카테고리(코스 집합)를 나타냅니다.
type Recommendation struct {
	ID          int
	Title       string
	Description string
	CourseIds   []int
} 