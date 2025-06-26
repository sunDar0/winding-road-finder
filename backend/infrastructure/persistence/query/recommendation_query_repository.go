package query

import (
	"encoding/json"
	"os"

	"github.com/sunDar0/winding-road-finder/backend/domain/recommendation"
)

// RecommendationQueryRepositoryImpl는 recommendations.json 파일을 읽어 추천 목록을 반환합니다.
type RecommendationQueryRepositoryImpl struct{}

func NewRecommendationQueryRepository() *RecommendationQueryRepositoryImpl {
	return &RecommendationQueryRepositoryImpl{}
}

func (repo *RecommendationQueryRepositoryImpl) FindAll() ([]*recommendation.Recommendation, error) {
	file, err := os.Open("data/recommendations.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()
	var recs []*recommendation.Recommendation
	if err := json.NewDecoder(file).Decode(&recs); err != nil {
		return nil, err
	}
	return recs, nil
}

func (repo *RecommendationQueryRepositoryImpl) FindById(id int) (*recommendation.Recommendation, error) {
	file, err := os.Open("data/recommendations.json")
	if err != nil {
		return nil, err
	}
	defer file.Close()
	var recs []*recommendation.Recommendation
	if err := json.NewDecoder(file).Decode(&recs); err != nil {
		return nil, err
	}
	// 실제 ID로 검색
	for _, rec := range recs {
		if rec.ID == id {
			return rec, nil
		}
	}
	return nil, nil
} 