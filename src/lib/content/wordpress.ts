import type { ContentPost, ContentCategory, ContentTag, ContentAuthor, ContentFilters } from './types';

const WORDPRESS_ENDPOINT = import.meta.env.WORDPRESS_ENDPOINT || 'https://www.lesvillageois.org/wp-json/';
const WORDPRESS_API_URL = WORDPRESS_ENDPOINT.replace(/\/$/, '') + '/wp/v2';
const FETCH_TIMEOUT = 3000;

let wpAvailable: boolean | null = null;
let wpCheckTime = 0;
const WP_CHECK_INTERVAL = 60000;

async function isWordPressAvailable(): Promise<boolean> {
  const now = Date.now();
  if (wpAvailable !== null && (now - wpCheckTime) < WP_CHECK_INTERVAL) {
    return wpAvailable;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${WORDPRESS_API_URL}`, { 
      signal: controller.signal,
      method: 'HEAD'
    });
    clearTimeout(timeoutId);
    wpAvailable = response.ok;
  } catch {
    wpAvailable = false;
  }
  
  wpCheckTime = now;
  return wpAvailable;
}

async function fetchWithTimeout(url: string, timeout: number = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWordPressData<T>(endpoint: string): Promise<T[]> {
  try {
    const response = await fetchWithTimeout(`${WORDPRESS_API_URL}/${endpoint}`);
    if (!response.ok) {
      console.warn(`WordPress API error: ${response.status}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch WordPress ${endpoint}:`, error);
    return [];
  }
}

export async function getWordPressPosts(filters?: ContentFilters): Promise<ContentPost[]> {
  if (!(await isWordPressAvailable())) {
    return [];
  }
  
  const params = new URLSearchParams();
  params.append('per_page', String(filters?.limit || 100));
  if (filters?.offset) params.append('offset', String(filters.offset));
  params.append('_embed', 'true');
  
  try {
    const response = await fetchWithTimeout(`${WORDPRESS_API_URL}/posts?${params.toString()}`);
    if (!response.ok) {
      console.warn(`WordPress posts API error: ${response.status}`);
      return [];
    }
    
    const posts = await response.json();
    
    let filteredPosts = posts;
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter((post: any) => 
        post.title.rendered.toLowerCase().includes(searchLower) ||
        post.excerpt.rendered.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredPosts.map((post: any) => transformWordPressPost(post));
  } catch (error) {
    console.warn('Failed to fetch WordPress posts:', error);
    return [];
  }
}

export async function getWordPressPostBySlug(slug: string): Promise<ContentPost | null> {
  if (!(await isWordPressAvailable())) {
    return null;
  }
  
  try {
    const response = await fetchWithTimeout(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=true`);
    if (!response.ok) return null;
    
    const posts = await response.json();
    if (posts.length === 0) return null;
    
    return transformWordPressPost(posts[0]);
  } catch (error) {
    console.warn(`Failed to fetch WordPress post by slug ${slug}:`, error);
    return null;
  }
}

export async function getWordPressCategories(): Promise<ContentCategory[]> {
  if (!(await isWordPressAvailable())) {
    return [];
  }
  
  const categories = await fetchWordPressData<any>('categories?per_page=100');
  
  return categories.map(cat => ({
    id: String(cat.id),
    slug: cat.slug,
    name: cat.name,
    description: cat.description || '',
    count: cat.count || 0,
    parent: cat.parent ? String(cat.parent) : undefined,
  }));
}

export async function getWordPressTags(): Promise<ContentTag[]> {
  if (!(await isWordPressAvailable())) {
    return [];
  }
  
  const tags = await fetchWordPressData<any>('tags?per_page=100');
  
  return tags.map(tag => ({
    id: String(tag.id),
    slug: tag.slug,
    name: tag.name,
    count: tag.count || 0,
  }));
}

export async function getWordPressAuthors(): Promise<ContentAuthor[]> {
  if (!(await isWordPressAvailable())) {
    return [];
  }
  
  const users = await fetchWordPressData<any>('users?per_page=100');
  
  return users.map(user => ({
    id: String(user.id),
    name: user.name,
    slug: user.slug,
    description: user.description || '',
    avatarUrl: user.avatar_urls?.['96'] || user.avatar_urls?.['48'],
  }));
}

function transformWordPressPost(post: any): ContentPost {
  let featuredImage: ContentPost['featuredImage'] = undefined;
  
  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    featuredImage = {
      url: media.source_url,
      alt: media.alt_text || post.title.rendered,
      width: media.media_details?.width,
      height: media.media_details?.height,
    };
  }
  
  let categories: string[] = [];
  if (post._embedded?.['wp:term']?.[0]) {
    categories = post._embedded['wp:term'][0].map((cat: any) => cat.name);
  }
  
  let tags: string[] = [];
  if (post._embedded?.['wp:term']?.[1]) {
    tags = post._embedded['wp:term'][1].map((tag: any) => tag.name);
  }
  
  let authorName = 'Les Villageois 2.0';
  if (post._embedded?.author?.[0]) {
    authorName = post._embedded.author[0].name;
  }
  
  return {
    id: String(post.id),
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    date: new Date(post.date),
    modifiedDate: new Date(post.modified),
    author: authorName,
    categories,
    tags,
    featuredImage,
    source: 'wordpress',
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .trim();
}
