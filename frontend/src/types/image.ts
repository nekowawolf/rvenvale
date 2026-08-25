export interface Image {
  _id?: string;
  filename: string;
  url: string;
  size?: number;
  sha: string;
  path: string;
  created_at?: string;
}

export interface ImageStats {
  total_images: number;
  total_size: number;
}