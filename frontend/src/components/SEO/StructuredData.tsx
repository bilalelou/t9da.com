'use client';

import { useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  regular_price: number;
  sale_price?: number;
  thumbnail: string;
  short_description: string;
}

interface StructuredDataProps {
  type: 'website' | 'product' | 'organization' | 'breadcrumb';
  data?: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    let schema = {};

    switch (type) {
      case 'website':
        schema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "T9da.com",
          "alternateName": "تقدة",
          "url": "https://t9da.com",
          "description": "متجر إلكتروني متكامل في المغرب للتسوق أونلاين بأفضل الأسعار",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://t9da.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://t9da.com/#organization"
          }
        };
        break;

      case 'organization':
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://t9da.com/#organization",
          "name": "T9da.com",
          "alternateName": "تقدة",
          "url": "https://t9da.com",
          "logo": "https://t9da.com/images/logo.png",
          "description": "متجر إلكتروني رائد في المغرب يوفر أفضل المنتجات بأسعار منافسة",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "MA",
            "addressLocality": "المغرب"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+212-XXX-XXXXXX",
            "contactType": "customer service",
            "availableLanguage": ["Arabic", "French"]
          },
          "sameAs": [
            "https://facebook.com/t9da",
            "https://instagram.com/t9da",
            "https://twitter.com/t9da"
          ]
        };
        break;

      case 'product':
        if (data) {
          schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.name,
            "description": data.short_description || data.description,
            "image": data.thumbnail,
            "sku": data.id.toString(),
            "offers": {
              "@type": "Offer",
              "price": data.sale_price || data.regular_price,
              "priceCurrency": "MAD",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "T9da.com"
              }
            },
            "brand": {
              "@type": "Brand",
              "name": "T9da.com"
            }
          };
        }
        break;
    }

    if (Object.keys(schema).length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = `structured-data-${type}`;
      
      const existing = document.getElementById(`structured-data-${type}`);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(script);
    }

    return () => {
      const script = document.getElementById(`structured-data-${type}`);
      if (script) {
        script.remove();
      }
    };
  }, [type, data]);

  return null;
}