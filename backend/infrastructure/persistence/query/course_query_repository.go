package query

import (
	"encoding/json"
	"os"
	"strings"
	"sync"

	"github.com/sunDar0/winding-road-finder/backend/domain/course"
)

// CourseQueryRepositoryImpl는 courses.json 파일을 읽어 데이터를 반환하는 구현체입니다.
type CourseQueryRepositoryImpl struct {
	courses []*course.CourseAggregate
	once    sync.Once
	loadErr error
}

func NewCourseQueryRepository() *CourseQueryRepositoryImpl {
	return &CourseQueryRepositoryImpl{}
}

func (repo *CourseQueryRepositoryImpl) loadCourses() ([]*course.CourseAggregate, error) {
	repo.once.Do(func() {
		file, err := os.Open("backend/data/courses.json")
		if err != nil {
			repo.loadErr = err
			return
		}
		defer file.Close()
		var courses []*course.CourseAggregate
		if err := json.NewDecoder(file).Decode(&courses); err != nil {
			repo.loadErr = err
			return
		}
		repo.courses = courses
	})
	return repo.courses, repo.loadErr
}

func (repo *CourseQueryRepositoryImpl) FindAll(region, style, search string) ([]*course.CourseAggregate, error) {
	courses, err := repo.loadCourses()
	if err != nil {
		return nil, err
	}
	var result []*course.CourseAggregate
	for _, c := range courses {
		if region != "" && region != "all" && c.Region != region {
			continue
		}
		if style != "" && style != "all" {
			found := false
			for _, s := range c.Styles {
				if s == style {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}
		if search != "" && !strings.Contains(strings.ToLower(c.Name), strings.ToLower(search)) && !strings.Contains(strings.ToLower(c.Tagline), strings.ToLower(search)) && !strings.Contains(strings.ToLower(c.Characteristics), strings.ToLower(search)) && !strings.Contains(strings.ToLower(c.Region), strings.ToLower(search)) {
			continue
		}
		result = append(result, c)
	}
	return result, nil
}

func (repo *CourseQueryRepositoryImpl) FindByID(id int) (*course.CourseAggregate, error) {
	courses, err := repo.loadCourses()
	if err != nil {
		return nil, err
	}
	for _, c := range courses {
		if c.ID == id {
			return c, nil
		}
	}
	return nil, nil
}
