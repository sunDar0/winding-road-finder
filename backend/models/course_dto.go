package models

// CourseNavDto는 내비게이션 경로 정보를 담습니다.
type CourseNavDto struct {
	Type string `json:"type"`
	Name string `json:"name"`
	Geolocation CourseGeolocationDto `json:"geolocation"`
}

type CourseGeolocationDto struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// CourseRatingsDto는 코스의 5가지 특성 점수를 담습니다.
type CourseRatingsDto struct {
	Tech    int `json:"tech"`
	Speed   int `json:"speed"`
	Scenery int `json:"scenery"`
	Road    int `json:"road"`
	Access  int `json:"access"`
}

// CourseDto는 코스 정보를 담는 데이터 전송 객체입니다.
type CourseDto struct {
	ID             int                `json:"id"`
	Name           string             `json:"name"`
	Region         string             `json:"region"`
	Tagline        string             `json:"tagline"`
	Characteristics string            `json:"characteristics"`
	Nav            []CourseNavDto     `json:"nav"`
	Notes          string             `json:"notes"`
	Styles         []string           `json:"styles"`
	Ratings        CourseRatingsDto   `json:"ratings"`
}

// RecommendationDto는 추천 카테고리 응답을 정의합니다.
type RecommendationDto struct {
	ID          int         `json:"id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Courses     []CourseDto `json:"courses"`
} 
