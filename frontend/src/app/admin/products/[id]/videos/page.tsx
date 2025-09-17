'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import ProductVideoManager from '@/components/admin/ProductVideoManager';
import { toast } from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: {
    name: string;
  };
  brand: {
    name: string;
  };
}

export default function ProductVideosPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProduct(data.data);
      } else {
        toast.error('خطأ في تحميل بيانات المنتج');
      }
    } catch {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">جاري التحميل...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">المنتج غير موجود</h2>
            <p className="text-gray-600 mb-4">لم يتم العثور على المنتج المطلوب</p>
            <Link href="/admin/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة للمنتجات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للمنتجات
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Package className="h-6 w-6" />
              إدارة فيديوهات المنتج
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">اسم المنتج:</span>
                <p className="mt-1">{product.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">الفئة:</span>
                <p className="mt-1">{product.category?.name || 'غير محدد'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">العلامة التجارية:</span>
                <p className="mt-1">{product.brand?.name || 'غير محدد'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">رمز المنتج:</span>
                <p className="mt-1">{product.sku}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">الرابط:</span>
                <p className="mt-1 text-blue-600">/{product.slug}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Manager */}
      <ProductVideoManager 
        productId={productId} 
        productTitle={product.name}
      />
    </div>
  );
}