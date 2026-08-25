import { Image, ImageStats } from "@/types/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ===================== PUBLIC ENDPOINTS =====================

export const getAllImages = async (): Promise<Image[]> => {
  const response = await fetch(`${API_BASE_URL}/images`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch images");
  }

  const result = await response.json();
  return result.data ?? result;
};

export const getImageStats = async (): Promise<ImageStats> => {
  const response = await fetch(`${API_BASE_URL}/images/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch stats");
  }

  const result = await response.json();
  return result.data ?? result;
};

// ===================== WRITE ENDPOINTS =====================

export const uploadImage = async (
  file: File
): Promise<Image> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to upload image");
  }

  const result = await response.json();
  return result.data ?? result;
};

export const deleteImage = async (
  id: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/images/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete image");
  }
};