import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'T9da.com - متجر إلكتروني متكامل',
    short_name: 'T9da',
    description: 'متجر إلكتروني رائد في المغرب للتسوق أونلاين بأفضل الأسعار',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f59e0b',
    orientation: 'portrait',
    scope: '/',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    categories: ['shopping', 'business'],
    shortcuts: [
      {
        name: 'عروض اليوم',
        short_name: 'العروض',
        description: 'اكتشف أفضل العروض والتخفيضات',
        url: '/offers',
        icons: [{ src: '/icons/offers-icon.png', sizes: '96x96' }]
      },
      {
        name: 'المنتجات الجديدة',
        short_name: 'جديد',
        description: 'اكتشف أحدث المنتجات',
        url: '/new-arrivals',
        icons: [{ src: '/icons/new-icon.png', sizes: '96x96' }]
      },
      {
        name: 'السلة',
        short_name: 'السلة',
        description: 'عرض سلة التسوق',
        url: '/cart',
        icons: [{ src: '/icons/cart-icon.png', sizes: '96x96' }]
      }
    ]
  }
}