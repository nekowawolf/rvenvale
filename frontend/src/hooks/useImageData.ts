import { useState, useEffect } from "react";
import { getAllImages, deleteImage } from "@/services/imageService";
import { Image } from "@/types/image";

export const useImageData = () => {
  const [data, setData] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllImages();
      const validData = Array.isArray(result)
        ? result.filter((item) => item && item._id && item.filename && item.url)
        : [];
      setData(validData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch images";
      // If backend is unreachable (live demo), ignore error and show empty state
      if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
        setError(null);
        setData([]);
      } else {
        setError(message);
      }
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage(id);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err: unknown) {
      console.error("Error deleting image:", err);
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete image"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData, handleDelete };
};