// 코스 관련 타입 정의
export interface CourseGeolocation {
  latitude: number;
  longitude: number;
}

export interface CourseNav {
  type: string;
  name: string;
  geolocation: CourseGeolocation;
}

export interface CourseRatings {
  tech: number;
  speed: number;
  scenery: number;
  road: number;
  access: number;
}

export interface Course {
  id: number;
  name: string;
  region: string;
  tagline: string;
  characteristics: string;
  nav: CourseNav[];
  notes: string;
  styles: string[];
  ratings: CourseRatings;
  naverMapUrl: string;
}

// 필터 관련 타입
export interface CourseFilters {
  region: string;
  style: string;
  search: string;
}
