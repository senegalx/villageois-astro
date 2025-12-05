export interface ContentPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: Date;
  modifiedDate: Date;
  author: string;
  categories: string[];
  tags: string[];
  featuredImage?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  source: 'wordpress' | 'markdown' | 'custom';
}

export interface ContentCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  count: number;
  parent?: string;
}

export interface ContentTag {
  id: string;
  slug: string;
  name: string;
  count: number;
}

export interface ContentAuthor {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatarUrl?: string;
}

export interface SiteSettings {
  name: string;
  description: string;
  url: string;
}

export interface ContentFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
