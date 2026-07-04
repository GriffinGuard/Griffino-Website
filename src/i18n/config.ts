export const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'fr', 'de', 'ru'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';
export const aliases: Record<string, Locale> = {
  'zh': 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
};
export function normalizeLanguage(lang: string | null | undefined): Locale {
  if (!lang) return defaultLocale;
  if ((locales as readonly string[]).includes(lang)) return lang as Locale;
  const base = lang.split('-')[0];
  return aliases[lang] ?? aliases[base] ?? ((locales as readonly string[]).includes(base) ? base as Locale : defaultLocale);
}
