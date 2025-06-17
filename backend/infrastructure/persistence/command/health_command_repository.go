package command

import (
	"github.com/sunDar0/winding-road-finder/backend/domain/health"
)

// HealthCommandRepositoryImpl는 Command 용 HealthRepository 구현체입니다.
type HealthCommandRepositoryImpl struct{}

func NewHealthCommandRepository() *HealthCommandRepositoryImpl {
	return &HealthCommandRepositoryImpl{}
}

func (repo *HealthCommandRepositoryImpl) Save(h *health.HealthAggregate) error {
	// 실제 저장 로직은 추후 구현
	return nil
}

func (repo *HealthCommandRepositoryImpl) FindStatus() (string, error) {
	// 실제 조회 로직은 추후 구현
	return "ok (command repo)", nil
}
