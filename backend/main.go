package main

import (
	"github.com/gin-gonic/gin"

	appQuery "github.com/sunDar0/winding-road-finder/backend/application/query"
	queryRepo "github.com/sunDar0/winding-road-finder/backend/infrastructure/persistence/query"
	queryCtrl "github.com/sunDar0/winding-road-finder/backend/interfaces/controllers/query"
	routes "github.com/sunDar0/winding-road-finder/backend/interfaces/routes"
)

func main() {
	r := gin.Default()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// CQRS 의존성 주입 및 라우트 등록
	repo := queryRepo.NewCourseQueryRepository()
	service := appQuery.NewCourseQueryService(repo)
	controller := queryCtrl.NewCourseQueryController(service)
	routes.RegisterRoutes(r, controller)

	r.Run(":8080")
}
