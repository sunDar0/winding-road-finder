package command

// HealthCommandService는 상태 변경(명령) 비즈니스 로직을 담당합니다.
type HealthCommandService struct{}

func NewHealthCommandService() *HealthCommandService {
	return &HealthCommandService{}
}

// ExecuteCommand는 실제 명령을 처리하는 메서드입니다.
func (svc *HealthCommandService) ExecuteCommand() error {
	// 실제 비즈니스 로직은 추후 구현
	return nil
}
