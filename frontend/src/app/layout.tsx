import type { Metadata } from "next";
import { HydrationErrorBoundary } from "@/components/HydrationErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "T9da.com - متجر إلكتروني متكامل في المغرب | أفضل الأسعار والجودة",
    template: "%s | T9da.com - متجر إلكتروني متكامل"
  },
  description: "T9da.com هو متجرك الإلكتروني المتكامل في المغرب. اكتشف مجموعة واسعة من المنتجات بأفضل الأسعار، بما في ذلك الإلكترونيات، الهواتف الذكية، الأجهزة المنزلية، الأزياء، منتجات الجمال والصحة، والمزيد. استمتع بتجربة تسوق سهلة، عروض حصرية، وتوصيل سريع وموثوق به إلى جميع المدن المغربية. تسوق الآن واحصل على أفضل الصفقات!",
  keywords: [
    "متجر إلكتروني المغرب", "تسوق أونلاين المغرب", "أفضل الأسعار المغرب", "توصيل سريع المغرب",
    "إلكترونيات المغرب", "هواتف ذكية المغرب", "أجهزة منزلية المغرب", "ملابس المغرب",
    "جمال وصحة المغرب", "عروض المغرب", "تخفيضات المغرب", "منتجات جديدة المغرب",
    "t9da", "تقدة", "e-commerce Morocco", "online shopping Morocco", "Maroc",
    "أزياء المغرب", "مطبخ المغرب", "ديكور المنزل المغرب", "ألعاب أطفال المغرب",
    "مستلزمات رياضية المغرب", "كتب المغرب", "مستحضرات تجميل المغرب", "عطور المغرب"
  ],
  authors: [{ name: "T9da.com Team" }],
  creator: "T9da.com",
  publisher: "T9da.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-MA': '/ar',
      'fr-MA': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_MA',
    url: '/',
    title: 'T9da.com - متجر إلكتروني متكامل في المغرب',
    description: 'متجر T9da.com الإلكتروني الرائد في المغرب. تسوق أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع المدن المغربية.',
    siteName: 'T9da.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'T9da.com - متجر إلكتروني متكامل',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T9da.com - متجر إلكتروني متكامل في المغرب',
    description: 'تسوق أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع المدن المغربية',
    images: ['/images/twitter-image.jpg'],
    creator: '@t9da_com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'T9da.com',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com',
              logo: (process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com') + '/images/logo.png',
              sameAs: [
                'https://www.facebook.com/',
                'https://www.instagram.com/',
                'https://x.com/'
              ]
            })
          }}
        />
        <HydrationErrorBoundary>
          {children}
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}
