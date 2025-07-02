#!/bin/bash

# 개발 환경 시작 스크립트
# 백엔드(Go)와 프론트엔드(Next.js) 서비스를 동시에 실행

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 프로세스 종료 함수
cleanup() {
    log_info "서비스 종료 중..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        log_info "백엔드 프로세스 종료됨 (PID: $BACKEND_PID)"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        log_info "프론트엔드 프로세스 종료됨 (PID: $FRONTEND_PID)"
    fi
    
    # 임시 로그 파일 정리
    rm -f /tmp/backend.log /tmp/frontend.log
    
    log_success "모든 서비스가 종료되었습니다."
    exit 0
}

# 시그널 핸들러 설정
trap cleanup SIGINT SIGTERM

# 의존성 확인
check_dependencies() {
    log_info "의존성 확인 중..."
    
    # Go 확인
    if ! command -v go &> /dev/null; then
        log_error "Go가 설치되지 않았습니다. https://golang.org/dl/ 에서 설치해주세요."
        exit 1
    fi
    
    # Node.js 확인
    if ! command -v node &> /dev/null; then
        log_error "Node.js가 설치되지 않았습니다. https://nodejs.org/ 에서 설치해주세요."
        exit 1
    fi
    
    # pnpm 확인
    if ! command -v pnpm &> /dev/null; then
        log_warning "pnpm이 설치되지 않았습니다. npm을 사용합니다."
        PACKAGE_MANAGER="npm"
    else
        PACKAGE_MANAGER="pnpm"
    fi
    
    log_success "의존성 확인 완료"
}

# 백엔드 서비스 시작
start_backend() {
    log_info "백엔드 서비스 시작 중..."
    
    cd backend
    
    # Go 모듈 다운로드
    if [ ! -f "go.sum" ]; then
        log_info "Go 모듈 다운로드 중..."
        go mod download
    fi
    
    # 백엔드 실행 (백그라운드)
    go run main.go > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    
    log_success "백엔드 서비스 시작됨 (PID: $BACKEND_PID)"
    log_info "백엔드 로그: tail -f /tmp/backend.log"
    
    cd ..
}

# 프론트엔드 서비스 시작
start_frontend() {
    log_info "프론트엔드 서비스 시작 중..."
    
    cd frontend
    
    # 의존성 설치 확인
    if [ ! -d "node_modules" ]; then
        log_info "프론트엔드 의존성 설치 중..."
        $PACKAGE_MANAGER install
    fi
    
    # 프론트엔드 실행 (백그라운드)
    $PACKAGE_MANAGER run dev > /tmp/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    log_success "프론트엔드 서비스 시작됨 (PID: $FRONTEND_PID)"
    log_info "프론트엔드 로그: tail -f /tmp/frontend.log"
    
    cd ..
}

# 서비스 상태 확인
check_services() {
    log_info "서비스 상태 확인 중..."
    
    # 백엔드 상태 확인
    sleep 3
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        log_success "백엔드 서비스가 정상적으로 실행 중입니다. (http://localhost:8080)"
    else
        log_warning "백엔드 서비스 상태를 확인할 수 없습니다. 로그를 확인해주세요."
    fi
    
    # 프론트엔드 상태 확인
    sleep 2
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log_success "프론트엔드 서비스가 정상적으로 실행 중입니다. (http://localhost:3000)"
    else
        log_warning "프론트엔드 서비스 상태를 확인할 수 없습니다. 로그를 확인해주세요."
    fi
}

# 메인 실행
main() {
    echo "=========================================="
    echo "    Winding Road Guide 개발 환경 시작"
    echo "=========================================="
    echo ""
    
    check_dependencies
    start_backend
    start_frontend
    check_services
    
    echo ""
    echo "=========================================="
    echo "    서비스가 모두 시작되었습니다!"
    echo "=========================================="
    echo "백엔드: http://localhost:8080"
    echo "프론트엔드: http://localhost:3000"
    echo ""
    echo "로그 확인:"
    echo "  백엔드: tail -f /tmp/backend.log"
    echo "  프론트엔드: tail -f /tmp/frontend.log"
    echo ""
    echo "종료하려면 Ctrl+C를 누르세요."
    echo "=========================================="
    
    # 프로세스가 종료될 때까지 대기
    wait
}

# 스크립트 실행
main "$@" 