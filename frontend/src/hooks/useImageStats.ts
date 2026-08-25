import { useState, useEffect } from "react";
import { getImageStats } from "@/services/imageService";
import { ImageStats } from "@/types/image";

export const useImageStats = () => {
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getImageStats();
      setStats(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch stats";
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError(null);
        setStats({ total_images: 0, total_size: 0 });
      } else {
        setError(message);
      }
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};