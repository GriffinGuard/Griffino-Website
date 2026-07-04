export interface NavItem {
  href: string;
  i18nKey: string;
}

// Single source of truth for the primary site navigation.
// Vision and Community are covered inside the About page, so they have no
// standalone nav entries.
export const navItems: NavItem[] = [
  { href: '/index.html', i18nKey: 'nav.home' },
  { href: '/download.html', i18nKey: 'nav.download' },
  { href: '/guide.html', i18nKey: 'nav.guide' },
  { href: '/plugins.html', i18nKey: 'nav.plugins' },
  { href: '/repositories.html', i18nKey: 'nav.repos' },
  { href: '/docs.html', i18nKey: 'nav.docs' },
  { href: '/about.html', i18nKey: 'nav.about' },
];
