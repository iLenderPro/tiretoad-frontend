import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const production = process.env.NEXT_PUBLIC_BACKEND_URL === 'https://api.tiretoad.com';
  return production
    ? {
        rules: {
          userAgent: '*',
          allow: '/',
        },
        sitemap: 'https://tiretoad.com/sitemap.xml',
      }
    : {
        rules: {
          userAgent: '*',
          disallow: '/',
        },
      };
}
