import { ui } from './ui';
import { defaultLocale, type Locale } from './config';

export { ui } from './ui';
export { locales, defaultLocale, normalizeLanguage, type Locale } from './config';

export function t(locale: Locale, key: string): string | undefined {
  return ui[locale]?.[key] ?? ui[defaultLocale]?.[key];
}
