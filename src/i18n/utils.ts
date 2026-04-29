import { defaultLang, languages, ui, type Lang } from './ui';

export { defaultLang, languages, type Lang } from './ui';

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang], subs?: Record<string, string>) {
    let str: string = (ui[lang]?.[key] ?? ui[defaultLang][key]) as string;
    if (subs) {
      for (const [k, v] of Object.entries(subs)) {
        str = str.replaceAll(`{${k}}`, v);
      }
    }
    return str;
  };
}

export function getAlternateUrl(url: URL, targetLang: Lang): URL {
  const currentLang = url.pathname.split('/')[1] || defaultLang;
  const path = url.pathname.slice(currentLang.length + 1) || '/';
  return new URL(`/${targetLang}${path}`, url.origin);
}
