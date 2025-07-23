package utils

import (
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"path/filepath"

	"github.com/sunDar0/winding-road-finder/backend/domain/course"
)

// MapImageGenerator는 네이버 지도 API를 사용해 정적 이미지를 생성합니다.
type MapImageGenerator struct {
	config *Config
}

// NewMapImageGenerator는 새로운 지도 이미지 생성기를 생성합니다.
func NewMapImageGenerator(config *Config) *MapImageGenerator {
	return &MapImageGenerator{config: config}
}

// GenerateImageForCourse는 주어진 코스에 대해 썸네일과 상세 이미지를 생성합니다.
func (g *MapImageGenerator) GenerateImageForCourse(courseAgg *course.CourseAggregate) error {
	if !g.config.IsNaverConfigValid() {
		return fmt.Errorf("네이버 API 설정이 유효하지 않습니다")
	}

	if len(courseAgg.Nav) == 0 {
		return fmt.Errorf("코스 %d: 내비게이션 데이터가 없습니다", courseAgg.ID)
	}

	// 디렉토리 생성
	if err := g.ensureDirectories(); err != nil {
		return err
	}

	// 썸네일 이미지 생성 (500x500)
	thumbnailURL := g.buildMapURL(courseAgg, 500, 500)
	thumbnailPath := fmt.Sprintf("public/images/courses/thumbnails/course-%d.png", courseAgg.ID)
	if err := g.downloadImage(thumbnailURL, thumbnailPath); err != nil {
		return fmt.Errorf("썸네일 이미지 생성 실패 (코스 %d): %v", courseAgg.ID, err)
	}

	// 상세 이미지 생성 (800x600)
	detailURL := g.buildMapURL(courseAgg, 800, 600)
	detailPath := fmt.Sprintf("public/images/courses/detail/course-%d.png", courseAgg.ID)
	if err := g.downloadImage(detailURL, detailPath); err != nil {
		return fmt.Errorf("상세 이미지 생성 실패 (코스 %d): %v", courseAgg.ID, err)
	}

	fmt.Printf("코스 %d (%s) 이미지 생성 완료\n", courseAgg.ID, courseAgg.Name)
	return nil
}

// ensureDirectories는 필요한 디렉토리를 생성합니다.
func (g *MapImageGenerator) ensureDirectories() error {
	dirs := []string{
		"public/images/courses/thumbnails",
		"public/images/courses/detail",
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("디렉토리 생성 실패 (%s): %v", dir, err)
		}
	}
	return nil
}

// buildMapURL은 네이버 지도 API URL을 구성합니다.
func (g *MapImageGenerator) buildMapURL(courseAgg *course.CourseAggregate, width, height int) string {
	// 중심점 계산
	centerLat, centerLng := g.calculateCenter(courseAgg.Nav)
	
	// 줌 레벨 계산
	zoom := g.calculateZoomLevel(courseAgg.Nav)
	
	// 마커 생성
	markers := g.buildMarkers(courseAgg.Nav)

	// URL 구성 (마커는 직접 추가하여 이중 인코딩 방지)
	baseURL := "https://maps.apigw.ntruss.com/map-static/v2/raster"
	params := url.Values{}
	params.Set("w", fmt.Sprintf("%d", width))
	params.Set("h", fmt.Sprintf("%d", height))
	params.Set("center", fmt.Sprintf("%f,%f", centerLng, centerLat))
	params.Set("level", fmt.Sprintf("%d", zoom))
	params.Set("scale", "2")
	params.Set("format", "png")
	
	baseQuery := params.Encode()
	
	// 마커가 있으면 직접 추가 (인코딩 방지)
	if markers != "" {
		return fmt.Sprintf("%s?%s&markers=%s", baseURL, baseQuery, markers)
	}
	
	return fmt.Sprintf("%s?%s", baseURL, baseQuery)
}

// calculateCenter는 경로점들의 중심점을 계산합니다.
func (g *MapImageGenerator) calculateCenter(navPoints []course.CourseNav) (float64, float64) {
	if len(navPoints) == 0 {
		return 37.5665, 126.9780 // 서울 기본 좌표
	}

	var latSum, lngSum float64
	for _, point := range navPoints {
		latSum += point.Geolocation.Latitude
		lngSum += point.Geolocation.Longitude
	}

	return latSum / float64(len(navPoints)), lngSum / float64(len(navPoints))
}

// calculateZoomLevel은 경로점들의 분산에 따라 적절한 줌 레벨을 계산합니다.
func (g *MapImageGenerator) calculateZoomLevel(navPoints []course.CourseNav) int {
	if len(navPoints) < 2 {
		return 14
	}

	var latitudes, longitudes []float64
	for _, point := range navPoints {
		latitudes = append(latitudes, point.Geolocation.Latitude)
		longitudes = append(longitudes, point.Geolocation.Longitude)
	}

	latDiff := g.maxFloat64(latitudes) - g.minFloat64(latitudes)
	lngDiff := g.maxFloat64(longitudes) - g.minFloat64(longitudes)
	maxDiff := math.Max(latDiff, lngDiff)

	switch {
	case maxDiff < 0.005:
		return 16
	case maxDiff < 0.01:
		return 15
	case maxDiff < 0.02:
		return 14
	case maxDiff < 0.05:
		return 13
	case maxDiff < 0.1:
		return 12
	case maxDiff < 0.2:
		return 11
	case maxDiff < 0.5:
		return 10
	default:
		return 9
	}
}

// buildMarkers는 경로점들에 대한 마커 문자열을 생성합니다.
func (g *MapImageGenerator) buildMarkers(navPoints []course.CourseNav) string {
	if len(navPoints) == 0 {
		return ""
	}

	var markers []string
	for i, point := range navPoints {
		var color string
		switch {
		case i == 0:
			color = "red" // 출발점
		case i == len(navPoints)-1:
			color = "green" // 도착점
		default:
			color = "blue" // 경유점
		}

		marker := fmt.Sprintf("type:d|size:mid|color:%s|pos:%f%%20%f",
			color, point.Geolocation.Longitude, point.Geolocation.Latitude)
		markers = append(markers, marker)
	}

	// 첫 번째 마커는 그대로, 나머지는 &markers= 형태로
	result := markers[0]
	for i := 1; i < len(markers); i++ {
		result += "&markers=" + markers[i]
	}

	return result
}

// downloadImage는 URL에서 이미지를 다운로드하고 저장합니다.
func (g *MapImageGenerator) downloadImage(imageURL, filePath string) error {
	// HTTP 요청 생성
	req, err := http.NewRequest("GET", imageURL, nil)
	if err != nil {
		return fmt.Errorf("요청 생성 실패: %v", err)
	}

	// 헤더 설정
	req.Header.Set("x-ncp-apigw-api-key-id", g.config.NaverClientID)
	req.Header.Set("x-ncp-apigw-api-key", g.config.NaverClientSecret)

	// HTTP 요청 실행
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("HTTP 요청 실패: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("네이버 API 에러: %d %s", resp.StatusCode, resp.Status)
	}

	// 파일 생성
	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		return fmt.Errorf("디렉토리 생성 실패: %v", err)
	}

	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("파일 생성 실패: %v", err)
	}
	defer file.Close()

	// 이미지 데이터 저장
	_, err = io.Copy(file, resp.Body)
	if err != nil {
		return fmt.Errorf("이미지 저장 실패: %v", err)
	}

	return nil
}

// 유틸리티 함수들
func (g *MapImageGenerator) maxFloat64(values []float64) float64 {
	if len(values) == 0 {
		return 0
	}
	max := values[0]
	for _, v := range values[1:] {
		if v > max {
			max = v
		}
	}
	return max
}

func (g *MapImageGenerator) minFloat64(values []float64) float64 {
	if len(values) == 0 {
		return 0
	}
	min := values[0]
	for _, v := range values[1:] {
		if v < min {
			min = v
		}
	}
	return min
} 