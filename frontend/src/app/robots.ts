import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/user-dashboard/',
          '/api/',
          '/checkout',
          '/cart',
          '/login',
          '/register',
          '/forgot-password',
          '/*?*', // منع فهرسة الصفحات مع parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/user-dashboard/',
          '/api/',
          '/checkout',
          '/cart',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}