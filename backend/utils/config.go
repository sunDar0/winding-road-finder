package utils

import (
	"os"
)

// Config는 애플리케이션 설정을 담는 구조체입니다.
type Config struct {
	NaverClientID     string
	NaverClientSecret string
}

// LoadConfig는 환경변수에서 설정을 로드합니다.
func LoadConfig() *Config {
	return &Config{
		NaverClientID:     os.Getenv("NEXT_PUBLIC_NAVER_CLIENT_ID"),
		NaverClientSecret: os.Getenv("NEXT_PUBLIC_NAVER_CLIENT"),
	}
}

// IsNaverConfigValid는 네이버 API 설정이 유효한지 확인합니다.
func (c *Config) IsNaverConfigValid() bool {
	return c.NaverClientID != "" && c.NaverClientSecret != ""
} 