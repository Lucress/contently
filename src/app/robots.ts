import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/ideas', '/planner', '/production', '/collab', '/emails', '/revenue', '/analytics', '/settings', '/onboarding', '/api/'],
      },
    ],
    sitemap: 'https://contentlyapp.com/sitemap.xml',
    host: 'https://contentlyapp.com',
  }
}
