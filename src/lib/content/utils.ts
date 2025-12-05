import type { ContentPost } from './types';

export function formatDate(date: Date, locale: string = 'fr-FR'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(date: Date, locale: string = 'fr-FR'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function sortPostsByDate(posts: ContentPost[], order: 'asc' | 'desc' = 'desc'): ContentPost[] {
  return [...posts].sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return order === 'desc' ? -diff : diff;
  });
}

export function filterPostsByCategory(posts: ContentPost[], category: string): ContentPost[] {
  return posts.filter(post => 
    post.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  );
}

export function filterPostsByTag(posts: ContentPost[], tag: string): ContentPost[] {
  return posts.filter(post => 
    post.tags.some(t => 
      t.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function searchPosts(posts: ContentPost[], query: string): ContentPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery)
  );
}

export function paginatePosts(posts: ContentPost[], page: number, perPage: number): {
  posts: ContentPost[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(posts.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  
  return {
    posts: posts.slice(start, end),
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function getUniqueCategories(posts: ContentPost[]): string[] {
  const categories = new Set<string>();
  posts.forEach(post => {
    post.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
}

export function getUniqueTags(posts: ContentPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}
