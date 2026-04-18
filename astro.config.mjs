// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { getDraftSlugs } from './src/utils/blog.mjs';

const draftSlugs = getDraftSlugs();

// https://astro.build/config
export default defineConfig({
  site: 'https://ludat.io',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !draftSlugs.some((slug) => page.includes(`/blog/${slug}/`)),
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
