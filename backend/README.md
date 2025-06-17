# Winding Road Guide - Backend

와인딩 코스 추천 서비스의 백엔드 프로젝트입니다.

## 기술 스택
- Go 1.23.4
- Gin Framework
- Swagger
- Domain-Driven Design

## 프로젝트 구조
```
backend/
├── application/         # 서비스 계층
│   ├── command/        # 명령 서비스
│   └── query/          # 조회 서비스
├── data/               # 정적 데이터(JSON)
├── docs/               # Swagger 문서
├── domain/             # 도메인 모델
│   ├── course/        # 코스 도메인
│   └── recommendation/ # 추천 도메인
├── infrastructure/     # 인프라 계층
│   └── persistence/   # 영속성 관리
├── interfaces/         # 인터페이스 계층
│   ├── controllers/   # API 컨트롤러
│   └── routes/        # 라우팅 설정
└── models/            # DTO 모델
```

## API 명세

### 코스 API
#### 코스 목록 조회
- **GET /api/courses**
- 응답: CourseDto 배열

#### 코스 상세 조회
- **GET /api/courses/:id**
- 응답: CourseDto

### 추천 API
#### 추천 목록 조회
- **GET /api/recommendations**
- 응답: RecommendationDto 배열

#### 추천 상세 조회
- **GET /api/recommendations/:id**
- 응답: RecommendationDto

## 데이터 모델

### CourseDto
```go
type CourseDto struct {
    ID             int      `json:"id"`
    Name           string   `json:"name"`
    Region         string   `json:"region"`
    Tagline        string   `json:"tagline"`
    Characteristics string   `json:"characteristics"`
    Nav            []string `json:"nav"`
    Notes          string   `json:"notes"`
    Styles         []string `json:"styles"`
    Ratings        struct {
        Tech    int `json:"tech"`
        Speed   int `json:"speed"`
        Scenery int `json:"scenery"`
        Road    int `json:"road"`
        Access  int `json:"access"`
    } `json:"ratings"`
}
```

### RecommendationDto
```go
type RecommendationDto struct {
    Title       string      `json:"title"`
    Description string      `json:"description"`
    Courses     []CourseDto `json:"courses"`
}
```

## 시작하기

### 필수 조건
- Go 1.23.4 이상

### 설치 및 실행
```bash
# 의존성 설치
go mod tidy

# 개발 서버 실행
go run main.go
```

### Swagger 문서 업데이트
```bash
# Swagger 문서 생성
swag init
```

## API 문서
서버 실행 후 다음 URL에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다:
- http://localhost:8080/swagger/index.html 