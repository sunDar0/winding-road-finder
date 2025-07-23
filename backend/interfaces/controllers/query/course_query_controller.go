package query

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	appQuery "github.com/sunDar0/winding-road-finder/backend/application/query"
	"github.com/sunDar0/winding-road-finder/backend/domain/course"
	"github.com/sunDar0/winding-road-finder/backend/models"
)

// ErrorResponse는 API 에러 응답을 정의합니다.
type ErrorResponse struct {
	Error string `json:"error"`
}

// CourseQueryController는 코스 목록/상세 조회 요청을 처리합니다.
type CourseQueryController struct {
	service    *appQuery.CourseQueryService
	recService *appQuery.RecommendationQueryService
}

func NewCourseQueryController(service *appQuery.CourseQueryService, recService *appQuery.RecommendationQueryService) *CourseQueryController {
	return &CourseQueryController{service: service, recService: recService}
}

// RegisterRoutes는 Gin 라우터에 엔드포인트를 등록합니다.
func (ctrl *CourseQueryController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/courses", ctrl.GetCourses)
	rg.GET("/courses/:id", ctrl.GetCourseByID)
	rg.GET("/recommendations", ctrl.GetRecommendations)
	rg.GET("/recommendations/:id", ctrl.GetRecommendationById)
}

// @Summary 코스 목록 조회
// @Description 지역, 스타일, 검색어로 코스를 필터링하여 조회합니다.
// @Tags courses
// @Accept json
// @Produce json
// @Param region query string false "지역 필터"
// @Param style query string false "스타일 필터"
// @Param search query string false "검색어"
// @Success 200 {array} models.CourseDto
// @Failure 500 {object} ErrorResponse
// @Router /courses [get]
func (ctrl *CourseQueryController) GetCourses(c *gin.Context) {
	region := c.Query("region")
	style := c.Query("style")
	search := c.Query("search")
	courses, err := ctrl.service.GetCourses(region, style, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	var dtos []models.CourseDto
	for _, agg := range courses {
		dtos = append(dtos, toCourseDto(agg))
	}
	c.JSON(http.StatusOK, dtos)
}

// @Summary 코스 상세 조회
// @Description ID로 코스 상세 정보를 조회합니다.
// @Tags courses
// @Accept json
// @Produce json
// @Param id path int true "코스 ID"
// @Success 200 {object} models.CourseDto
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /courses/{id} [get]
func (ctrl *CourseQueryController) GetCourseByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid id"})
		return
	}
	agg, err := ctrl.service.GetCourseByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	if agg == nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "not found"})
		return
	}
	dto := toCourseDto(agg)
	c.JSON(http.StatusOK, dto)
}

// @Summary 추천 코스 목록 조회
// @Description 추천 카테고리별 코스 목록을 조회합니다.
// @Tags recommendations
// @Accept json
// @Produce json
// @Success 200 {array} models.RecommendationDto
// @Failure 500 {object} ErrorResponse
// @Router /recommendations [get]
func (ctrl *CourseQueryController) GetRecommendations(c *gin.Context) {
	recs, err := ctrl.recService.GetRecommendationsWithCourses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	var result []models.RecommendationDto
	for _, rec := range recs {
		var courseDtos []models.CourseDto
		for _, agg := range rec.Courses {
			courseDtos = append(courseDtos, toCourseDto(agg))
		}
		result = append(result, models.RecommendationDto{
			ID:          rec.ID,
			Title:       rec.Title,
			Description: rec.Description,
			Courses:     courseDtos,
		})
	}
	c.JSON(http.StatusOK, result)
}

// @Summary 추천 코스 상세 조회
// @Description ID로 추천 코스 상세 정보를 조회합니다.
// @Tags recommendations
// @Accept json
// @Produce json
// @Param id path int true "추천 ID"
// @Success 200 {object} models.RecommendationDto
// @Failure 400 {object} ErrorResponse "잘못된 ID 형식"
// @Failure 404 {object} ErrorResponse "추천 정보를 찾을 수 없음"
// @Failure 500 {object} ErrorResponse "서버 오류"
// @Router /recommendations/{id} [get]
func (ctrl *CourseQueryController)GetRecommendationById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid id"})
		return
	}
	rec, err := ctrl.recService.GetRecommendationById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}
	if rec == nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "recommendation not found"})
		return
	}
	
	// RecommendationWithCourses를 RecommendationDto로 변환
	var courseDtos []models.CourseDto
	for _, agg := range rec.Courses {
		courseDtos = append(courseDtos, toCourseDto(agg))
	}
	
	result := models.RecommendationDto{
		ID:          rec.ID,
		Title:       rec.Title,
		Description: rec.Description,
		Courses:     courseDtos,
	}
	
	c.JSON(http.StatusOK, result)
}

// 도메인 모델을 DTO로 변환
func toCourseDto(agg *course.CourseAggregate) models.CourseDto {
	navs := make([]models.CourseNavDto, len(agg.Nav))
	for i, n := range agg.Nav {
		navs[i] = models.CourseNavDto{
			Type: n.Type,
			Name: n.Name,
			Geolocation: models.CourseGeolocationDto{
				Latitude:  n.Geolocation.Latitude,
				Longitude: n.Geolocation.Longitude,
			},
		}
	}
	return models.CourseDto{
		ID:              agg.ID,
		Name:            agg.Name,
		Region:          agg.Region,
		Tagline:         agg.Tagline,
		Characteristics: agg.Characteristics,
		NaverMapUrl:     agg.NaverMapUrl,
		ThumbnailImage:  fmt.Sprintf("/images/courses/thumbnails/course-%d.png", agg.ID),
		DetailImage:     fmt.Sprintf("/images/courses/detail/course-%d.png", agg.ID),
		Nav:             navs,
		Notes:           agg.Notes,
		Styles:          agg.Styles,
		Ratings: models.CourseRatingsDto{
			Tech:    agg.Ratings.Tech,
			Speed:   agg.Ratings.Speed,
			Scenery: agg.Ratings.Scenery,
			Road:    agg.Ratings.Road,
			Access:  agg.Ratings.Access,
		},
	}
} 