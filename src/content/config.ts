import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { wpCollections } from 'dewp/loaders';

const wordpress = wpCollections({
  endpoint: "https://www.lesvillageois.org/wp-json/",
});

const localBlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/local/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Équipe Villageois 2.0'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const localPages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/local/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  ...wordpress,
  localBlog,
  localPages,
};
