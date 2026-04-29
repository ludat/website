import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { languages, ui } from '../../i18n/ui';

export function getStaticPaths() {
  return Object.keys(languages).map((locale) => ({ params: { locale } }));
}

export async function GET(context) {
  const locale = context.params.locale;
  const posts = (await getCollection('blog')).filter((p) => p.id.endsWith(`/${locale}`));
  return rss({
    title: ui[locale]['site.title'],
    description: ui[locale]['site.description'],
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/${locale}/blog/${post.data.urlSlug}/`,
    })),
  });
}
