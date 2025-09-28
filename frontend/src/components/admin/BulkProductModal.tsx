'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  LoaderCircle, 
  Package, 
  AlertCircle,
  CheckCircle,
  Truck
} from 'lucide-react';

interface ProductRow {
  id: string;
  name: string;
  short_description: string;
  description: string;
  regular_price: string;
  sale_price: string;
  quantity: string;
  category_id: string;
  brand_id: string;
  has_free_shipping: boolean;
  free_shipping_note: string;
}

interface BulkError {
  index: number;
  name: string;
  error: string;
}

interface CreatedProduct {
  index: number;
  id: number;
  name: string;
  sku: string;
}

interface BulkResultDetails {
  created_products?: CreatedProduct[];
  errors?: BulkError[];
  summary?: {
    total_attempted: number;
    successful: number;
    failed: number;
  };
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface BulkProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BulkProductModal: React.FC<BulkProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [products, setProducts] = useState<ProductRow[]>([createEmptyProduct()]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  function createEmptyProduct(): ProductRow {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      short_description: '',
      description: '',
      regular_price: '',
      sale_price: '',
      quantity: '',
      category_id: '',
      brand_id: '',
      has_free_shipping: false,
      free_shipping_note: '',
    };
  }

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchBrands();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const token = localStorage.getItem('api_token');
      
      console.log('جلب التصنيفات - Token:', token ? 'موجود' : 'غير موجود');
      console.log('URL:', `${apiUrl}/categories`);
      
      const response = await fetch(`${apiUrl}/categories`, {
        headers: { 
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      console.log('استجابة التصنيفات - الحالة:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('بيانات التصنيفات:', data);
        setCategories(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('فشل في جلب التصنيفات:', response.status, errorText);
      }
    } catch (error) {
      console.error('خطأ في جلب التصنيفات:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const token = localStorage.getItem('api_token');
      
      console.log('جلب العلامات التجارية - Token:', token ? 'موجود' : 'غير موجود');
      console.log('URL:', `${apiUrl}/brands`);
      
      const response = await fetch(`${apiUrl}/brands`, {
        headers: { 
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      console.log('استجابة العلامات التجارية - الحالة:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('بيانات العلامات التجارية:', data);
        setBrands(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('فشل في جلب العلامات التجارية:', response.status, errorText);
      }
    } catch (error) {
      console.error('خطأ في جلب العلامات التجارية:', error);
    }
  };

  const updateProduct = (index: number, field: keyof ProductRow, value: any) => {
    setProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const addProductRow = () => {
    setProducts(prev => [...prev, createEmptyProduct()]);
  };

  const removeProductRow = (index: number) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateProducts = (): string[] => {
    const errors: string[] = [];
    
    products.forEach((product, index) => {
      const rowNum = index + 1;
      
      if (!product.name.trim()) {
        errors.push(`الصف ${rowNum}: اسم المنتج مطلوب`);
      }
      
      if (!product.regular_price || isNaN(Number(product.regular_price)) || Number(product.regular_price) < 0) {
        errors.push(`الصف ${rowNum}: السعر العادي يجب أن يكون رقماً موجباً`);
      }
      
      if (product.sale_price && (isNaN(Number(product.sale_price)) || Number(product.sale_price) < 0)) {
        errors.push(`الصف ${rowNum}: سعر التخفيض يجب أن يكون رقماً موجباً`);
      }
      
      if (product.sale_price && Number(product.sale_price) >= Number(product.regular_price)) {
        errors.push(`الصف ${rowNum}: سعر التخفيض يجب أن يكون أقل من السعر العادي`);
      }
      
      if (!product.quantity || isNaN(Number(product.quantity)) || Number(product.quantity) < 0) {
        errors.push(`الصف ${rowNum}: الكمية يجب أن تكون رقماً موجباً`);
      }
      
      if (!product.category_id) {
        errors.push(`الصف ${rowNum}: التصنيف مطلوب`);
      }
    });
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateProducts();
    
    if (errors.length > 0) {
      setSubmitResult({
        success: false,
        message: 'يوجد أخطاء في البيانات:',
        details: errors
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const token = localStorage.getItem('api_token');

      const response = await fetch(`${apiUrl}/products/bulk-store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          products: products.map(product => {
            const formattedProduct = {
              ...product,
              regular_price: Number(product.regular_price),
              sale_price: product.sale_price ? Number(product.sale_price) : null,
              quantity: Number(product.quantity),
              category_id: Number(product.category_id),
              brand_id: product.brand_id ? Number(product.brand_id) : null,
              has_free_shipping: Boolean(product.has_free_shipping),
            };
            console.log('إرسال منتج:', formattedProduct);
            return formattedProduct;
          })
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: data.message,
          details: data.data
        });
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setSubmitResult({
          success: false,
          message: data.message || 'حدث خطأ غير متوقع',
          details: data.errors || data.data || null
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: 'خطأ في الاتصال بالخادم',
        details: null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProducts([createEmptyProduct()]);
    setSubmitResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6" />
            <h2 className="text-xl font-bold">إضافة عدة منتجات دفعة واحدة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Result Display */}
          {submitResult && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              submitResult.success 
                ? 'bg-green-50 border-green-500 text-green-700' 
                : 'bg-red-50 border-red-500 text-red-700'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {submitResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {submitResult.message}
              </div>
              
              {submitResult.details && (
                <div className="mt-3">
                  {Array.isArray(submitResult.details) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {submitResult.details.map((detail: BulkError | string, index: number) => (
                        <li key={index} className="text-sm">
                          {typeof detail === 'string' ? detail : 
                           typeof detail === 'object' && detail.error ? 
                           `منتج ${detail.index || index + 1}: ${detail.error}` :
                           JSON.stringify(detail)}
                        </li>
                      ))}
                    </ul>
                  ) : typeof submitResult.details === 'object' ? (
                    <div className="text-sm">
                      <p>تم إضافة {submitResult.details.summary?.successful || 0} منتج بنجاح</p>
                      {submitResult.details.errors?.length > 0 && (
                        <>
                          <p className="mb-2">فشل في إضافة {submitResult.details.errors.length} منتج:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            {submitResult.details.errors?.map((error: BulkError, index: number) => (
                              <li key={index}>
                                {error.name ? `${error.name}: ${error.error}` : error.error || String(error)}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {submitResult.details.created_products?.length > 0 && (
                        <>
                          <p className="mt-2 mb-2">المنتجات المضافة بنجاح:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            {submitResult.details.created_products?.map((product: CreatedProduct, index: number) => (
                              <li key={index}>
                                {product.name} (SKU: {product.sku})
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{String(submitResult.details)}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">#</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">اسم المنتج *</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">الوصف المختصر</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">السعر العادي *</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">سعر التخفيض</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">الكمية *</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">التصنيف *</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">العلامة التجارية</th>
                  <th className="p-3 text-right text-sm font-medium text-gray-700 border-b">شحن مجاني</th>
                  <th className="p-3 text-center text-sm font-medium text-gray-700 border-b">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{index + 1}</td>
                    
                    {/* اسم المنتج */}
                    <td className="p-3 border-b">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="اسم المنتج"
                      />
                    </td>
                    
                    {/* الوصف المختصر */}
                    <td className="p-3 border-b">
                      <textarea
                        value={product.short_description}
                        onChange={(e) => updateProduct(index, 'short_description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="وصف مختصر"
                        rows={2}
                      />
                    </td>
                    
                    {/* السعر العادي */}
                    <td className="p-3 border-b">
                      <input
                        type="number"
                        value={product.regular_price}
                        onChange={(e) => updateProduct(index, 'regular_price', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    
                    {/* سعر التخفيض */}
                    <td className="p-3 border-b">
                      <input
                        type="number"
                        value={product.sale_price}
                        onChange={(e) => updateProduct(index, 'sale_price', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    
                    {/* الكمية */}
                    <td className="p-3 border-b">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </td>
                    
                    {/* التصنيف */}
                    <td className="p-3 border-b">
                      <select
                        value={product.category_id}
                        onChange={(e) => updateProduct(index, 'category_id', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">اختر التصنيف</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    {/* العلامة التجارية */}
                    <td className="p-3 border-b">
                      <select
                        value={product.brand_id}
                        onChange={(e) => updateProduct(index, 'brand_id', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">اختر العلامة</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    
                    {/* شحن مجاني */}
                    <td className="p-3 border-b">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={product.has_free_shipping}
                          onChange={(e) => updateProduct(index, 'has_free_shipping', e.target.checked)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <Truck className="w-4 h-4 ml-1 text-green-600" />
                      </div>
                    </td>
                    
                    {/* إجراءات */}
                    <td className="p-3 border-b text-center">
                      <button
                        onClick={() => removeProductRow(index)}
                        disabled={products.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed p-1"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={addProductRow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة صف
            </button>
            
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              إعادة تعيين
            </button>
            
            <span className="text-sm text-gray-600">
              عدد المنتجات: {products.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  إضافة المنتجات
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkProductModal;