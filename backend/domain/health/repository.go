package health

// HealthRepository는 health 도메인 저장소 인터페이스입니다.
type HealthRepository interface {
	Save(health *HealthAggregate) error
	FindStatus() (string, error)
}
