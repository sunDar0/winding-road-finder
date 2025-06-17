package query

import (
	"github.com/gin-gonic/gin"
)

// HealthQueryController는 조회(GET 등) 요청을 처리합니다.
type HealthQueryController struct{}

func NewHealthQueryController() *HealthQueryController {
	return &HealthQueryController{}
}

// RegisterRoutes는 Gin 라우터에 엔드포인트를 등록합니다.
func (ctrl *HealthQueryController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.GET("/health/query", ctrl.HandleQuery)
}

// HandleQuery는 조회 요청을 처리합니다.
func (ctrl *HealthQueryController) HandleQuery(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok (query)"})
}
