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

## API 연동

백엔드 API 문서는 다음 URL에서 확인할 수 있습니다:
- [Swagger UI](http://localhost:8080/swagger/index.html)
