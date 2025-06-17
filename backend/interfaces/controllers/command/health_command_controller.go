package command

import (
	"github.com/gin-gonic/gin"
)

// HealthCommandController는 상태 변경(POST 등) 요청을 처리합니다.
type HealthCommandController struct{}

func NewHealthCommandController() *HealthCommandController {
	return &HealthCommandController{}
}

// RegisterRoutes는 Gin 라우터에 엔드포인트를 등록합니다.
func (ctrl *HealthCommandController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/health/command", ctrl.HandleCommand)
}

// HandleCommand는 상태 변경 요청을 처리합니다.
func (ctrl *HealthCommandController) HandleCommand(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok (command)"})
}
