export const siteConfig = {
  name: 'Twitch Wheel of Names',
  description: 'Interactive wheel for Twitch streams - Let viewers join and spin to win!',
  url: 'https://wheel-of-names.example.com',
  author: 'Adrian Vu',
  links: {
    github: 'https://github.com/example/wheel-of-names',
    twitter: 'https://twitter.com/example',
  },
} as const;

export type SiteConfig = typeof siteConfig;
