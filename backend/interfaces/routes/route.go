package routes

import (
	"github.com/gin-gonic/gin"
	queryCtrl "github.com/sunDar0/winding-road-finder/backend/interfaces/controllers/query"
)

// RegisterRoutes는 모든 엔드포인트를 Gin 엔진에 등록합니다.
func RegisterRoutes(r *gin.Engine, courseQueryController *queryCtrl.CourseQueryController) {
	api := r.Group("/api")
	courseQueryController.RegisterRoutes(api)
}
