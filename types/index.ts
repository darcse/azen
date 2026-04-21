export interface AzenCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface AzenProduct {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  content: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AzenProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  created_at: string;
}
