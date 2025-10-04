import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductClient, { Product } from './ProductClient';

export const revalidate = 3600; // إعادة توليد الصفحة كل ساعة لتحسين SEO والتحديث

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return null;
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { next: { revalidate } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.product) return data.product as Product;
    return null;
  } catch {
    return null;
  }
}

// Helper function to generate comprehensive keywords
function generateKeywords(product: Product): string[] {
  const baseKeywords = [
    product.name,
    product.category?.name || '',
    product.brand?.name || '',
    'شراء', 'سعر', 'المغرب', 'تسوق أونلاين',
    'أفضل', 'عروض', 'تخفيضات', 'جديد', 'حصري'
  ];

  // Add keywords from description, splitting by common delimiters
  const descriptionKeywords = (product.short_description || product.description || '')
    .split(/[\s,.-]+/)
    .filter(Boolean)
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 2); // Filter out very short words

  const combinedKeywords = [...new Set([...baseKeywords, ...descriptionKeywords])]; // Use Set to remove duplicates
  return combinedKeywords.filter(Boolean).slice(0, 15); // Limit to 15 keywords for relevance
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com';
  if (!product) {
    return {
      title: 'المنتج غير موجود',
      description: 'المنتج المطلوب غير متوفر أو تم حذفه.',
      robots: { index: false, follow: false }
    };
  }

  const canonical = `${siteUrl}/products/${product.slug}`;
  const price = product.sale_price || product.regular_price;
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const mainImage = images[0];

  return {
    title: `${product.name} | شراء بأفضل سعر في المغرب`,
    description: product.short_description?.slice(0, 155) || product.description?.slice(0, 155),
    alternates: { canonical },
    openGraph: {
      type: 'website', // Changed to 'website' as 'product' is not a valid type for OpenGraph in Next.js Metadata
      url: canonical,
      title: product.name,
      description: product.short_description || product.description,
      images: images.map(url => ({ url, width: 800, height: 800, alt: product.name })),
      siteName: 'T9da.com'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.short_description || product.description,
      images: [mainImage]
    },
    keywords: generateKeywords(product),
    robots: { index: true, follow: true },
    other: {
      'product:price:amount': price?.toString() || '',
      'product:price:currency': 'MAD'
    }
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  // Structured Data JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com';
  const url = `${siteUrl}/products/${product.slug}`;
  const images = (product.images && product.images.length > 0 ? product.images : [product.thumbnail]).map(i => i.startsWith('http') ? i : `${siteUrl}${i}`);
  const offerPrice = product.sale_price || product.regular_price;
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.short_description || product.description,
    sku: product.id,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MAD',
      price: offerPrice,
      availability: product.stock_status === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'T9da.com'
      }
    },
    aggregateRating: product.total_reviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.average_rating,
      reviewCount: product.total_reviews
    } : undefined
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: siteUrl
      },
      product.category ? {
        '@type': 'ListItem',
        position: 2,
        name: product.category.name,
        item: `${siteUrl}/categories/${product.category.slug}`
      } : null,
      {
        '@type': 'ListItem',
        position: product.category ? 3 : 2,
        name: product.name,
        item: url
      }
    ].filter(Boolean)
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
