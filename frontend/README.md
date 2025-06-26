# Winding Road Guide - Frontend

와인딩 코스 추천 서비스의 프론트엔드 프로젝트입니다.

## 기술 스택

- Next.js 15
- TypeScript
- Tailwind CSS
- Chart.js
- React-ChartJS-2
- Heroicons

## 시작하기

### 필수 조건

- Node.js 18.17 이상
- pnpm

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── app/              # App Router 페이지
├── components/       # 재사용 가능한 컴포넌트
│   ├── layout/      # 레이아웃 관련 컴포넌트
│   ├── course/      # 코스 관련 컴포넌트
│   ├── filter/      # 필터링 관련 컴포넌트
│   ├── recommendation/ # 추천 관련 컴포넌트
│   └── safety/      # 안전 수칙 관련 컴포넌트
├── lib/             # 유틸리티 함수
├── hooks/           # 커스텀 훅
└── types/           # TypeScript 타입 정의

## 주요 기능

- 코스 목록 보기
- 코스 상세 정보
- 추천 코스 목록
- 지역별/스타일별 필터링
- 키워드 검색
- 상세 정보 차트
- 안전 수칙 안내

## 컴포넌트 상세

### CourseCard
- **기능**: 개별 코스 정보를 카드 형태로 표시
- **썸네일**: 네이버 지도 API를 활용한 정사각형 지도 썸네일 (500x500px)
- **스타일**: `h-48 aspect-square` 클래스로 정사각형 비율 보장
- **반응형**: 모든 화면 크기에서 일관된 정사각형 형태 유지

### RecommendationCard
- **기능**: 추천 코스 카테고리를 카드 형태로 표시
- **썸네일**: 깔끔한 빈 이미지 영역 (지도 썸네일 제거)
- **스타일**: `h-48 aspect-square` 클래스로 정사각형 비율 보장
- **최적화**: 불필요한 지도 API 호출 제거로 성능 향상

### Skeleton Components
- **CourseCardSkeleton**: 코스 카드 로딩 상태 표시
- **RecommendationCardSkeleton**: 추천 카드 로딩 상태 표시
- **일관성**: 실제 컴포넌트와 동일한 정사각형 썸네일 크기 적용

## 최근 UI 개선사항

### 썸네일 디자인 개선 (2025년)
1. **정사각형 비율 적용**
   - 모든 썸네일에 `aspect-square` 클래스 추가
   - 높이를 `h-32`에서 `h-48`로 증가하여 더 큰 시각적 임팩트 제공

2. **추천 카드 최적화**
   - 불필요한 지도 썸네일 제거
   - 깔끔한 빈 이미지 영역으로 대체
   - 성능 향상 및 사용자 경험 개선

3. **일관된 디자인 시스템**
   - 모든 카드 컴포넌트에서 동일한 썸네일 크기 적용
   - 스켈레톤 컴포넌트도 실제 컴포넌트와 일치하도록 업데이트

## API 연동

백엔드 API 문서는 다음 URL에서 확인할 수 있습니다:
- [Swagger UI](http://localhost:8080/swagger/index.html)

## 네이버 지도 API 설정

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 애플리케이션을 등록합니다.
2. Maps 서비스를 활성화합니다.
3. 애플리케이션의 Client ID를 복사하여 환경 변수에 설정합니다.
