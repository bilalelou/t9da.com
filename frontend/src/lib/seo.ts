// SEO utility functions

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export const defaultSEO: SEOConfig = {
  title: 'T9da.com - متجر إلكتروني متكامل في المغرب',
  description: 'متجر T9da.com الإلكتروني الرائد في المغرب. تسوق أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع المدن المغربية. إلكترونيات، ملابس، منزل ومطبخ، جمال وصحة وأكثر.',
  keywords: [
    'متجر إلكتروني',
    'تسوق أونلاين',
    'المغرب',
    'توصيل سريع',
    'أسعار منافسة',
    'إلكترونيات',
    'هواتف ذكية',
    'ملابس',
    'منزل ومطبخ',
    'جمال وصحة',
    't9da',
    'تقدة'
  ],
  image: '/images/og-image.jpg',
  url: 'https://t9da.com',
  type: 'website'
};

export function generateSEO(config: SEOConfig = {}) {
  const seo = { ...defaultSEO, ...config };
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    openGraph: {
      type: seo.type,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.image || defaultSEO.image!,
          width: 1200,
          height: 630,
          alt: seo.title,
        }
      ],
      url: seo.url,
      siteName: 'T9da.com',
      locale: 'ar_MA',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image || defaultSEO.image!],
      creator: '@t9da_com',
    },
    robots: seo.noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: seo.url,
    },
  };
}

export function generateProductSEO(product: any) {
  const price = product.sale_price || product.regular_price;
  const title = `${product.name} - بأفضل سعر في المغرب | T9da.com`;
  const description = `اشتري ${product.name} بأفضل سعر ${price} درهم مغربي. ${product.short_description || product.description || ''} توصيل سريع لجميع المدن المغربية.`;
  
  return generateSEO({
    title,
    description,
    keywords: [
      product.name,
      'شراء',
      'سعر',
      'المغرب',
      'توصيل',
      ...(product.category ? [product.category.name] : []),
      ...(product.brand ? [product.brand.name] : [])
    ],
    image: product.thumbnail,
    url: `/products/${product.slug}`,
    type: 'product'
  });
}

export function generateCategorySEO(category: any) {
  const title = `${category.name} - أفضل المنتجات بأسعار منافسة | T9da.com`;
  const description = `تسوق أفضل منتجات ${category.name} في المغرب. مجموعة واسعة من المنتجات عالية الجودة بأسعار منافسة مع توصيل سريع لجميع المدن المغربية.`;
  
  return generateSEO({
    title,
    description,
    keywords: [
      category.name,
      'منتجات',
      'تسوق',
      'المغرب',
      'أسعار منافسة',
      'جودة عالية'
    ],
    image: category.image,
    url: `/categories/${category.slug}`,
    type: 'website'
  });
}

// Generate FAQ Schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate Review Schema
export function generateReviewSchema(reviews: any[]) {
  if (!reviews || reviews.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": "عملاء T9da.com"
    }
  };
}