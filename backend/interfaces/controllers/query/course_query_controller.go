package query

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	appQuery "github.com/sunDar0/winding-road-finder/backend/application/query"
	"github.com/sunDar0/winding-road-finder/backend/domain/course"
	"github.com/sunDar0/winding-road-finder/backend/models"
)

// CourseQueryController는 코스 목록/상세 조회 요청을 처리합니다.
type CourseQueryController struct {
	service *appQuery.CourseQueryService
}

func NewCourseQueryController(service *appQuery.CourseQueryService) *CourseQueryController {
	return &CourseQueryController{service: service}
}

// RegisterRoutes는 Gin 라우터에 엔드포인트를 등록합니다.
func (ctrl *CourseQueryController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/courses", ctrl.GetCourses)
	rg.GET("/courses/:id", ctrl.GetCourseByID)
}

// GetCourses는 코스 목록을 반환합니다.
func (ctrl *CourseQueryController) GetCourses(c *gin.Context) {
	region := c.Query("region")
	style := c.Query("style")
	search := c.Query("search")
	courses, err := ctrl.service.GetCourses(region, style, search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	var dtos []models.CourseDto
	for _, agg := range courses {
		dtos = append(dtos, toCourseDto(agg))
	}
	c.JSON(http.StatusOK, dtos)
}

// GetCourseByID는 코스 상세 정보를 반환합니다.
func (ctrl *CourseQueryController) GetCourseByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	agg, err := ctrl.service.GetCourseByID(id)
	if err != nil || agg == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	dto := toCourseDto(agg)
	c.JSON(http.StatusOK, dto)
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