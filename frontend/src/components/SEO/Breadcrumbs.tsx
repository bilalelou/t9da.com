'use client';

import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';
import StructuredData from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const breadcrumbItems = [
    { name: 'الرئيسية', url: '/' },
    ...items
  ];

  const structuredDataItems = breadcrumbItems.map(item => ({
    name: item.name,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://t9da.com'}${item.url}`
  }));

  return (
    <>
      <StructuredData type="breadcrumb" data={{ items: structuredDataItems }} />
      
      <nav 
        className={`flex items-center space-x-2 space-x-reverse text-sm text-gray-600 ${className}`}
        aria-label="مسار التنقل"
      >
        <ol className="flex items-center space-x-2 space-x-reverse">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronLeft 
                  className="w-4 h-4 mx-2 text-gray-400 rotate-180" 
                  aria-hidden="true" 
                />
              )}
              
              {index === 0 ? (
                <Link 
                  href={item.url}
                  className="flex items-center hover:text-blue-600 transition-colors"
                  aria-label="العودة للصفحة الرئيسية"
                >
                  <Home className="w-4 h-4 ml-1" />
                  <span>{item.name}</span>
                </Link>
              ) : index === breadcrumbItems.length - 1 ? (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link 
                  href={item.url}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}