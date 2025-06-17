package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/api/health/query", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok (query)"})
	})

	r.POST("/api/health/command", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok (command)"})
	})

	r.Run(":8080")
}
