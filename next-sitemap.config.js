// إعدادات next-sitemap لتحسين SEO
module.exports = {
  siteUrl: 'https://t9da.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin', '/dashboard'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://t9da.com/sitemap.xml',
    ],
  },
};
