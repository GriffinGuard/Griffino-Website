// Client-side i18n runtime.
// English (defaultLocale) is rendered statically at build time; this script
// swaps in the user's preferred locale at runtime by rewriting [data-i18n]
// text content. Mirrors the original app.js applyLanguage() behavior.
import { ui } from '../i18n/ui';
import { normalizeLanguage, defaultLocale, type Locale } from '../i18n/config';

const STORAGE_KEY = 'griffino-language';

function preferredLanguage(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return normalizeLanguage(stored);
  const detected = navigator.languages || [navigator.language];
  return normalizeLanguage(detected.find(Boolean) ?? defaultLocale);
}

function applyLanguage(lang: string): void {
  const normalized = normalizeLanguage(lang);
  const dictionary = ui[normalized] ?? ui[defaultLocale];
  const fallback = ui[defaultLocale];
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) return;
    const value = dictionary[key] ?? fallback[key];
    if (value) node.textContent = value;
  });
  document.documentElement.lang = normalized;
  const select = document.getElementById('languageSelect') as HTMLSelectElement | null;
  if (select) select.value = normalized;
  localStorage.setItem(STORAGE_KEY, normalized);
}

applyLanguage(preferredLanguage());

const select = document.getElementById('languageSelect');
if (select) {
  select.addEventListener('change', (event) => {
    applyLanguage((event.target as HTMLSelectElement).value);
  });
}
