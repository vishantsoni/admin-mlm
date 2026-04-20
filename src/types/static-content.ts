export interface StaticContent {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface States{
  id: number;
  name: string;
}