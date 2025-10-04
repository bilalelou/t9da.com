import type { Metadata } from "next";
import { HydrationErrorBoundary } from "@/components/HydrationErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "T9da.com - متجر إلكتروني متكامل في المغرب | أفضل الأسعار والجودة",
    template: "%s | T9da.com - متجر إلكتروني متكامل"
  },
  description: "متجر T9da.com الإلكتروني الرائد في المغرب. تسوق أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع المدن المغربية. إلكترونيات، ملابس، منزل ومطبخ، جمال وصحة وأكثر.",
  keywords: [
    "متجر إلكتروني", "تسوق أونلاين", "المغرب", "توصيل سريع", "أسعار منافسة",
    "إلكترونيات", "هواتف ذكية", "ملابس", "منزل ومطبخ", "جمال وصحة",
    "t9da", "تقدة", "e-commerce", "online shopping", "Morocco", "Maroc"
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
        <HydrationErrorBoundary>
          {children}
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}
