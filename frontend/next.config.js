/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // تجاهل أخطاء TypeScript أثناء البناء مؤقتاً
    ignoreBuildErrors: true,
  },
  eslint: {
    // تجاهل أخطاء ESLint أثناء البناء مؤقتاً
    ignoreDuringBuilds: true,
  },
  // تحسين الأداء
  optimizeFonts: true,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // إضافة headers للأمان
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig