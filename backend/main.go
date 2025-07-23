package main

import (
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/sunDar0/winding-road-finder/backend/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	appQuery "github.com/sunDar0/winding-road-finder/backend/application/query"
	queryRepo "github.com/sunDar0/winding-road-finder/backend/infrastructure/persistence/query"
	queryCtrl "github.com/sunDar0/winding-road-finder/backend/interfaces/controllers/query"
	routes "github.com/sunDar0/winding-road-finder/backend/interfaces/routes"
	"github.com/sunDar0/winding-road-finder/backend/utils"
)

// @title Winding Road Finder API
// @version 1.0
// @description 와인딩 로드 파인더 API 문서
// @host localhost:8080
// @BasePath /api
func main() {
	// .env 파일 로드
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// 환경변수 로드
	config := utils.LoadConfig()

	// 이미지 생성 부트스트랩
	if config.IsNaverConfigValid() {
		fmt.Println("네이버 지도 API 설정 확인됨. 코스 이미지 생성을 시작합니다...")
		if err := generateCourseImages(config); err != nil {
			log.Printf("이미지 생성 중 에러 발생: %v", err)
		} else {
			fmt.Println("모든 코스 이미지 생성 완료!")
		}
	} else {
		log.Println("네이버 API 설정이 없습니다. NEXT_PUBLIC_NAVER_CLIENT_ID와 NEXT_PUBLIC_NAVER_CLIENT 환경변수를 설정해주세요.")
	}

	r := gin.Default()

	// CORS 설정
	config_cors := cors.DefaultConfig()
	config_cors.AllowOrigins = []string{"http://localhost:3000"}
	config_cors.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config_cors.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	r.Use(cors.New(config_cors))

	// 정적 파일 서빙 설정
	r.Static("/images", "./public/images")

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

// generateCourseImages는 모든 코스에 대해 이미지를 생성합니다.
func generateCourseImages(config *utils.Config) error {
	// 코스 데이터 로드
	courseRepo := queryRepo.NewCourseQueryRepository()
	courses, err := courseRepo.FindAll("", "", "")
	if err != nil {
		return fmt.Errorf("코스 데이터 로드 실패: %v", err)
	}

	// 이미지 생성기 초기화
	generator := utils.NewMapImageGenerator(config)

	// 각 코스별로 이미지 생성
	successCount := 0
	for _, course := range courses {
		if err := generator.GenerateImageForCourse(course); err != nil {
			log.Printf("코스 %d 이미지 생성 실패: %v", course.ID, err)
		} else {
			successCount++
		}
	}

	fmt.Printf("총 %d개 코스 중 %d개 이미지 생성 성공\n", len(courses), successCount)
	return nil
}
