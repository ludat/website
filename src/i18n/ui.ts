export const languages = {
	en: 'English',
	es: 'Español',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

export const ui = {
	en: {
		'site.title': 'Ludat',
		'site.description': 'Personal website and blog',
		'nav.home': 'Home',
		'nav.blog': 'Blog',
		'nav.about': 'About',
		'nav.cv': 'CV',
		'footer.rights': 'All rights reserved.',
		'blog.lastUpdated': 'Last updated on',
	},
	es: {
		'site.title': 'Ludat',
		'site.description': 'Sitio personal y blog',
		'nav.home': 'Inicio',
		'nav.blog': 'Blog',
		'nav.about': 'Sobre mí',
		'nav.cv': 'CV',
		'footer.rights': 'Todos los derechos reservados.',
		'blog.lastUpdated': 'Última actualización el',
	},
} as const;
