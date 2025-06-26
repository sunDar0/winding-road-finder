import { api } from "@/lib/api";
import { Recommendation } from "@/types/course";
import { useEffect, useState } from "react";

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.recommendations.getAll();
      setRecommendations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    error,
    refetch: fetchRecommendations,
  };
}
