import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
}

export default function MetaTags({
  title = "T9da.com - متجر إلكتروني متكامل في المغرب",
  description = "متجر T9da.com الإلكتروني الرائد في المغرب. تسوق أفضل المنتجات بأسعار منافسة مع توصيل سريع لجميع المدن المغربية",
  keywords = "متجر إلكتروني, تسوق أونلاين, المغرب, توصيل سريع, أسعار منافسة",
  image = "/images/og-image.jpg",
  url = "https://t9da.com",
  type = "website",
  noIndex = false
}: MetaTagsProps) {
  const fullTitle = title.includes('T9da.com') ? title : `${title} | T9da.com`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="T9da.com" />
      <meta property="og:locale" content="ar_MA" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@t9da_com" />
      
      {/* Additional SEO */}
      <meta name="author" content="T9da.com" />
      <meta name="publisher" content="T9da.com" />
      <meta name="copyright" content="T9da.com" />
      <meta name="language" content="Arabic" />
      <meta name="geo.region" content="MA" />
      <meta name="geo.country" content="Morocco" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Alternate languages */}
      <link rel="alternate" hrefLang="ar" href={url} />
      <link rel="alternate" hrefLang="fr" href={`${url}/fr`} />
      <link rel="alternate" hrefLang="en" href={`${url}/en`} />
    </Head>
  );
}