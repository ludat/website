import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

function blogLoader(base: string) {
  const inner = glob({ base, pattern: '**/*.{md,mdx}' });
  return {
    ...inner,
    async load(context: Parameters<typeof inner.load>[0]) {
      return inner.load({
        ...context,
        parseData: (opts) => {
          const match = opts.id.match(/^(\d{4}-\d{2}-\d{2})/);
          if (!match) {
            throw new Error(`Blog entry "${opts.id}" is missing a date prefix (expected YYYY-MM-DD-slug/)`);
          }
          opts.data.pubDate = new Date(match[1] + 'T00:00:00');
          return context.parseData(opts);
        },
      });
    },
  };
}

const blogSchema = ({ image }: { image: Function }) =>
  z.object({
    title: z.string(),
    description: z.string(),
    urlSlug: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.optional(image()),
  });

const blog = defineCollection({
  loader: blogLoader('./src/content/blog'),
  schema: blogSchema,
});

const drafts = defineCollection({
  loader: blogLoader('./src/content/drafts'),
  schema: blogSchema,
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, drafts, pages };
