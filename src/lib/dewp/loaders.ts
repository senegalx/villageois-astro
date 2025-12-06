import { AstroError } from 'astro/errors';
import type { DataStore, Loader } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import {
  CategorySchema,
  CommentSchema,
  MediaSchema,
  PageSchema,
  PostSchema,
  SiteSettingsSchema,
  StatusSchema,
  TagSchema,
  TaxonomySchema,
  TypeSchema,
  UserSchema,
} from './schemas';

type DataEntry = Parameters<DataStore['set']>[0];

export function wpCollections({ endpoint }: { endpoint: string }) {
  if (!endpoint) {
    throw new AstroError(
      'Missing `endpoint` argument.',
      'Please pass a URL to your WordPress REST API endpoint as the `endpoint` option to the WordPress loader. Most commonly this looks something like `https://example.com/wp-json/`'
    );
  }
  if (!endpoint.endsWith('/')) endpoint += '/';
  const apiBase = new URL(endpoint);

  const l = (type: string) =>
    makeLoader({ name: `dewp-${type}`, url: new URL(`wp/v2/${type}`, apiBase) });

  return {
    posts: defineCollection({ schema: PostSchema, loader: l('posts') }),
    pages: defineCollection({ schema: PageSchema, loader: l('pages') }),
    tags: defineCollection({ schema: TagSchema, loader: l('tags') }),
    categories: defineCollection({ schema: CategorySchema, loader: l('categories') }),
    comments: defineCollection({ schema: CommentSchema, loader: l('comments') }),
    users: defineCollection({ schema: UserSchema, loader: l('users') }),
    media: defineCollection({ schema: MediaSchema, loader: l('media') }),
    statuses: defineCollection({ schema: StatusSchema, loader: l('statuses') }),
    taxonomies: defineCollection({ schema: TaxonomySchema, loader: l('taxonomies') }),
    types: defineCollection({ schema: TypeSchema, loader: l('types') }),
    'site-settings': defineCollection({
      schema: SiteSettingsSchema,
      loader: {
        name: 'dewp-site-settings',
        async load({ store, parseData }) {
          const id = 'settings';
          const rawData = await fetch(apiBase,{headers: {"Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (AstroApp)"}}).then((res) => res.json());
          const data = await parseData({ id, data: rawData });
          store.set({ id, data });
        },
      },
    }),
  };
}

function makeLoader({ name, url }: { name: string; url: URL }) {
  const loader: Loader = {
    name,
    async load({ store, parseData }) {
      const items = await fetchAll(url);
      for (const rawItem of items) {
        const item = await parseData({ id: String(rawItem.id), data: rawItem });
        const storeEntry: DataEntry = { id: String(item.id), data: item };
        if (item.content?.rendered) {
          storeEntry.rendered = { html: item.content.rendered };
        }
        store.set(storeEntry);
      }
    },
  };
  return loader;
}

/**
 * Fetch all pages for a paginated WP endpoint.
 */
async function fetchAll(url: URL, page = 1, results: any[] = []) {
  const pageUrl = new URL(url);
  pageUrl.searchParams.set('per_page', '100');
  pageUrl.searchParams.set('page', String(page));

  const response = await fetch(pageUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Mozilla/5.0 (AstroWP/1.0)"
    }
  });

  let data;
  try {
    data = await response.clone().json();
  } catch {
    const text = await response.text();
    console.error("WordPress API responded with non-JSON:", text);
    return results;
  }

  if (!Array.isArray(data)) {
    console.error("❌ This endpoint did NOT return an array:", url.toString());
    // console.error("Received:", data);
    return results;
  }

  results.push(...data);

  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');

  if (page < totalPages) {
    return fetchAll(url, page + 1, results);
  }

  return results;
}
