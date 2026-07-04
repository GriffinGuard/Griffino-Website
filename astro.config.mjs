import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://griffino.cc',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'fr', 'de', 'ru'],
    routing: { prefixDefaultLocale: false }
  }
});
