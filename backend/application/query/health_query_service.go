package query

// HealthQueryService는 조회(읽기) 비즈니스 로직을 담당합니다.
type HealthQueryService struct{}

func NewHealthQueryService() *HealthQueryService {
	return &HealthQueryService{}
}

// ExecuteQuery는 실제 조회를 처리하는 메서드입니다.
func (svc *HealthQueryService) ExecuteQuery() (string, error) {
	// 실제 비즈니스 로직은 추후 구현
	return "ok (query)", nil
}
