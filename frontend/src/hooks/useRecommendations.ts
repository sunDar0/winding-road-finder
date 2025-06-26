import { api } from "@/lib/api";
import { Recommendation } from "@/types/recommendation";
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
        err instanceof Error
          ? err.message
          : "추천 데이터를 불러오는데 실패했습니다."
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
