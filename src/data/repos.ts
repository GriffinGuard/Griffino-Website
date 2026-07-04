export interface Repo {
  /** Display name (org/name or short name) */
  name: string;
  /** GitHub URL */
  url: string;
  /** i18n key used on the repositories page: `page.repos.<id>` */
  pageKey: string;
  /** i18n key used on the homepage repo section: `repos.items.<id>` (only 7 repos have this) */
  homeKey?: string;
  /** Featured (core) repo — spans 2 columns on the grid */
  featured?: boolean;
  /** Whether the repo appears in the homepage repo section */
  onHomepage?: boolean;
}

// Full directory (12 repos) shown on /repositories.
// 7 of them also appear on the homepage (using the `repos.items.*` keys).
export const repos: Repo[] = [
  {
    name: 'GriffinGuard/Griffino',
    url: 'https://github.com/GriffinGuard/Griffino',
    pageKey: 'page.repos.core',
    homeKey: 'repos.items.core',
    featured: true,
    onHomepage: true,
  },
  {
    name: 'Griffino-WebUI',
    url: 'https://github.com/GriffinGuard/Griffino-WebUI',
    pageKey: 'page.repos.webui',
    homeKey: 'repos.items.webui',
    onHomepage: true,
  },
  {
    name: 'Griffino-Plugins',
    url: 'https://github.com/GriffinGuard/Griffino-Plugins',
    pageKey: 'page.repos.plugins',
    homeKey: 'repos.items.plugins',
    onHomepage: true,
  },
  {
    name: 'Griffino-Plugins-Submit',
    url: 'https://github.com/GriffinGuard/Griffino-Plugins-Submit',
    pageKey: 'page.repos.submit',
    homeKey: 'repos.items.submit',
    onHomepage: true,
  },
  {
    name: 'Griffino-Schemas',
    url: 'https://github.com/GriffinGuard/Griffino-Schemas',
    pageKey: 'page.repos.schemas',
    homeKey: 'repos.items.schemas',
    onHomepage: true,
  },
  {
    name: 'Griffino-Go',
    url: 'https://github.com/GriffinGuard/Griffino-Go',
    pageKey: 'page.repos.go',
    homeKey: 'repos.items.go',
    onHomepage: true,
  },
  {
    name: 'Griffino-Python',
    url: 'https://github.com/GriffinGuard/Griffino-Python',
    pageKey: 'page.repos.python',
    homeKey: 'repos.items.python',
    onHomepage: true,
  },
  {
    name: 'Griffino-Java',
    url: 'https://github.com/GriffinGuard/Griffino-Java',
    pageKey: 'page.repos.java',
  },
  {
    name: 'Griffino-CSharp',
    url: 'https://github.com/GriffinGuard/Griffino-CSharp',
    pageKey: 'page.repos.csharp',
  },
  {
    name: 'Griffino-Telegram-Plugin',
    url: 'https://github.com/GriffinGuard/Griffino-Telegram-Plugin',
    pageKey: 'page.repos.telegram',
  },
  {
    name: 'Griffino-AI',
    url: 'https://github.com/GriffinGuard/Griffino-AI',
    pageKey: 'page.repos.ai',
  },
  {
    name: 'Griffino-WebSearch',
    url: 'https://github.com/GriffinGuard/Griffino-WebSearch',
    pageKey: 'page.repos.websearch',
  },
];
