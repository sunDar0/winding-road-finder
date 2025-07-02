package course

// CourseGeolocation는 위도/경도 정보를 담는 도메인 구조체입니다.
type CourseGeolocation struct {
	Latitude  float64
	Longitude float64
}

// CourseNav는 내비게이션 포인트(출발지, 경유지, 도착지 등)를 나타냅니다.
type CourseNav struct {
	Type        string
	Name        string
	Geolocation CourseGeolocation
}

// CourseRatings는 코스의 5가지 특성 점수를 담습니다.
type CourseRatings struct {
	Tech    int
	Speed   int
	Scenery int
	Road    int
	Access  int
}

// CourseAggregate는 코스 도메인 모델입니다.
type CourseAggregate struct {
	ID              int
	Name            string
	Region          string
	Tagline         string
	Characteristics string
	NaverMapUrl     string
	Nav             []CourseNav
	Notes           string
	Styles          []string
	Ratings         CourseRatings
} 