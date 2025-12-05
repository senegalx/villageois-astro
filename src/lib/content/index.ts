export * from './types';
export * from './wordpress';
export * from './utils';

import { getCollection } from 'astro:content';
import { getWordPressPosts, getWordPressPostBySlug, getWordPressCategories, getWordPressTags, getWordPressAuthors } from './wordpress';
import type { ContentPost, ContentCategory, ContentTag, ContentAuthor, ContentFilters } from './types';

async function getLocalPosts(): Promise<ContentPost[]> {
  try {
    const localPosts = await getCollection('localBlog', ({ data }) => !data.draft);
    
    return localPosts.map(post => ({
      id: post.id,
      slug: post.id.replace(/\.md$/, ''),
      title: post.data.title,
      excerpt: post.data.excerpt,
      content: post.body || '',
      date: new Date(post.data.date),
      modifiedDate: new Date(post.data.date),
      author: post.data.author,
      categories: [post.data.category],
      tags: post.data.tags || [],
      featuredImage: post.data.image ? {
        url: post.data.image,
        alt: post.data.title,
      } : undefined,
      source: 'markdown' as const,
    }));
  } catch (error) {
    console.warn('Failed to get local posts:', error);
    return [];
  }
}

export async function getAllPosts(filters?: ContentFilters): Promise<ContentPost[]> {
  const localPosts = await getLocalPosts();
  
  const wpPostsPromise = getWordPressPosts(filters).catch(() => []);
  
  const wpPosts = await Promise.race([
    wpPostsPromise,
    new Promise<ContentPost[]>(resolve => setTimeout(() => resolve([]), 100))
  ]);
  
  const allPosts = [...wpPosts, ...localPosts];
  
  const sortedPosts = allPosts.sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );
  
  if (filters?.limit) {
    const start = filters.offset || 0;
    return sortedPosts.slice(start, start + filters.limit);
  }
  
  return sortedPosts;
}

export async function getPostBySlug(slug: string): Promise<ContentPost | null> {
  const localPosts = await getLocalPosts();
  const localPost = localPosts.find(p => p.slug === slug);
  if (localPost) return localPost;
  
  const wpPostPromise = getWordPressPostBySlug(slug).catch(() => null);
  
  const wpPost = await Promise.race([
    wpPostPromise,
    new Promise<ContentPost | null>(resolve => setTimeout(() => resolve(null), 100))
  ]);
  
  return wpPost;
}

export async function getAllCategories(): Promise<ContentCategory[]> {
  const localPosts = await getLocalPosts();
  
  const localCategories = new Set<string>();
  localPosts.forEach(post => {
    post.categories.forEach(cat => localCategories.add(cat));
  });
  
  const localCategoryObjects: ContentCategory[] = Array.from(localCategories).map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description: '',
    count: localPosts.filter(p => p.categories.includes(name)).length,
  }));
  
  const wpCategoriesPromise = getWordPressCategories().catch(() => []);
  
  const wpCategories = await Promise.race([
    wpCategoriesPromise,
    new Promise<ContentCategory[]>(resolve => setTimeout(() => resolve([]), 100))
  ]);
  
  const allCategories = [...localCategoryObjects];
  wpCategories.forEach(wpCat => {
    if (!allCategories.some(c => c.name === wpCat.name)) {
      allCategories.push(wpCat);
    }
  });
  
  return allCategories;
}

export async function getAllTags(): Promise<ContentTag[]> {
  return getWordPressTags();
}

export async function getAllAuthors(): Promise<ContentAuthor[]> {
  return getWordPressAuthors();
}

export async function getLatestPosts(limit: number = 5): Promise<ContentPost[]> {
  return getAllPosts({ limit });
}

export async function getRelatedPosts(post: ContentPost, limit: number = 3): Promise<ContentPost[]> {
  const allPosts = await getAllPosts();
  
  const related = allPosts
    .filter(p => p.id !== post.id)
    .map(p => {
      let score = 0;
      
      post.categories.forEach(cat => {
        if (p.categories.includes(cat)) score += 2;
      });
      
      post.tags.forEach(tag => {
        if (p.tags.includes(tag)) score += 1;
      });
      
      return { post: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
  
  if (related.length < limit) {
    const additional = allPosts
      .filter(p => p.id !== post.id && !related.some(r => r.id === p.id))
      .slice(0, limit - related.length);
    return [...related, ...additional];
  }
  
  return related;
}
