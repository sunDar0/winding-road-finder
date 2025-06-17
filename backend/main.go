package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/sunDar0/winding-road-finder/backend/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	appQuery "github.com/sunDar0/winding-road-finder/backend/application/query"
	queryRepo "github.com/sunDar0/winding-road-finder/backend/infrastructure/persistence/query"
	queryCtrl "github.com/sunDar0/winding-road-finder/backend/interfaces/controllers/query"
	routes "github.com/sunDar0/winding-road-finder/backend/interfaces/routes"
)

// @title Winding Road Guide API
// @version 1.0
// @description 와인딩 로드 가이드 API 문서
// @host localhost:8080
// @BasePath /api
func main() {
	r := gin.Default()

	// Swagger 설정
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// CQRS 의존성 주입 및 라우트 등록
	// 코스 조회 서비스 및 레포지토리
	courseRepo := queryRepo.NewCourseQueryRepository()
	courseService := appQuery.NewCourseQueryService(courseRepo)
	// 추천 코스 조회 서비스 및 레포지토리
	recRepo := queryRepo.NewRecommendationQueryRepository()
	recService := appQuery.NewRecommendationQueryService(recRepo, courseRepo)
	// 코스 컨트롤러
	controller := queryCtrl.NewCourseQueryController(courseService, recService)
	routes.RegisterRoutes(r, controller)

	r.Run(":8080")
}
