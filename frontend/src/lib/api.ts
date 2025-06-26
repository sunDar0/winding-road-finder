import { Course, CourseFilters, Recommendation } from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// API 클라이언트 클래스
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // 코스 목록 조회
  async getCourses(
    filters: CourseFilters = { region: "", style: "", search: "" }
  ): Promise<Course[]> {
    const params = new URLSearchParams();
    if (filters.region) params.append("region", filters.region);
    if (filters.style) params.append("style", filters.style);
    if (filters.search) params.append("search", filters.search);

    const endpoint = `/courses${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.request<Course[]>(endpoint);
  }

  // 코스 상세 조회
  async getCourseById(id: number): Promise<Course> {
    return this.request<Course>(`/courses/${id}`);
  }

  // 추천 코스 목록 조회
  async getRecommendations(): Promise<Recommendation[]> {
    return this.request<Recommendation[]>("/recommendations");
  }

  // 추천 코스 상세 조회
  async getRecommendationById(id: number): Promise<Recommendation> {
    return this.request<Recommendation>(`/recommendations/${id}`);
  }

  // 헬스 체크
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}

// API 클라이언트 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

// 편의 함수들
export const api = {
  courses: {
    getAll: (filters?: CourseFilters) => apiClient.getCourses(filters),
    getById: (id: number) => apiClient.getCourseById(id),
  },
  recommendations: {
    getAll: () => apiClient.getRecommendations(),
    getById: (id: number) => apiClient.getRecommendationById(id),
  },
  health: () => apiClient.healthCheck(),
};
