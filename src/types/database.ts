export interface User {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Scrapbook {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  theme: string;
  cover_style: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  scrapbook_id: string;
  page_number: number;
  background_color: string;
  canvas_json: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export interface Element {
  id: string;
  page_id: string;
  type: 'image' | 'text' | 'sticker' | 'shape' | 'ai_image';
  fabric_json: Record<string, unknown>;
  z_index: number;
  created_at: string;
}

export interface AIImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}
