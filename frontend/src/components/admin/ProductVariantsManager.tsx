'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Palette, Ruler, Package, Trash2 } from 'lucide-react';

interface Color {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
}

interface Size {
  id: number;
  name: string;
  display_name: string;
  sort_order: number;
  is_active: boolean;
}

interface ProductVariant {
  id?: number;
  color_id: number | null;
  size_id: number | null;
  sku: string;
  price: number;
  compare_price?: number;
  quantity: number;
  image?: string;
  is_active: boolean;
}

interface Props {
  onVariantsChange: (variants: ProductVariant[]) => void;
  initialVariants?: ProductVariant[];
}

const ProductVariantsManager: React.FC<Props> = ({ onVariantsChange, initialVariants = [] }) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>(initialVariants);
  const [hasVariants, setHasVariants] = useState(initialVariants.length > 0);
  const [error, setError] = useState<string | null>(null);

  // States for adding new variants
  const [newVariant, setNewVariant] = useState<Partial<ProductVariant>>({
    color_id: null,
    size_id: null,
    sku: '',
    price: 0,
    compare_price: 0,
    quantity: 0,
    is_active: true
  });

  // Fetch colors and sizes on component mount
  useEffect(() => {
    fetchColorsAndSizes();
  }, []);

  // Update local state when initialVariants change
  useEffect(() => {
    setVariants(initialVariants);
    setHasVariants(initialVariants.length > 0);
  }, [initialVariants]);

  // Update parent component when variants change
  useEffect(() => {
    onVariantsChange(variants);
  }, [variants, onVariantsChange]);

  const fetchColorsAndSizes = async () => {
    try {
      const token = localStorage.getItem('api_token') || '';
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

      const [colorsResponse, sizesResponse] = await Promise.all([
        fetch(`${apiUrl}/colors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        }),
        fetch(`${apiUrl}/sizes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
      ]);

      if (colorsResponse.ok && sizesResponse.ok) {
        const colorsData = await colorsResponse.json();
        const sizesData = await sizesResponse.json();
        
        setColors(colorsData.data || []);
        setSizes(sizesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching colors and sizes:', error);
      setError('فشل في تحميل الألوان والأحجام');
    }
  };

  const generateSKU = (colorId: number | null, sizeId: number | null) => {
    const color = colors.find(c => c.id === colorId);
    const size = sizes.find(s => s.id === sizeId);
    const timestamp = Date.now().toString().slice(-6);
    
    let sku = 'PRD-' + timestamp;
    if (color) sku += `-${color.name.substring(0, 3).toUpperCase()}`;
    if (size) sku += `-${size.name}`;
    
    return sku;
  };

  const addVariant = () => {
    if (!newVariant.color_id && !newVariant.size_id) {
      setError('يجب اختيار لون أو حجم على الأقل');
      return;
    }

    // Check if combination already exists
    const exists = variants.some(v => 
      v.color_id === newVariant.color_id && 
      v.size_id === newVariant.size_id
    );

    if (exists) {
      setError('هذه التركيبة من اللون والحجم موجودة بالفعل');
      return;
    }

    const sku = newVariant.sku || generateSKU(newVariant.color_id || null, newVariant.size_id || null);

    const variant: ProductVariant = {
      color_id: newVariant.color_id || null,
      size_id: newVariant.size_id || null,
      sku,
      price: newVariant.price || 0,
      compare_price: newVariant.compare_price,
      quantity: newVariant.quantity || 0,
      is_active: true
    };

    setVariants([...variants, variant]);
    setNewVariant({
      color_id: null,
      size_id: null,
      sku: '',
      price: 0,
      compare_price: 0,
      quantity: 0,
      is_active: true
    });
    setError(null);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const getColorName = (colorId: number | null) => {
    return colors.find(c => c.id === colorId)?.name || 'غير محدد';
  };

  const getSizeName = (sizeId: number | null) => {
    return sizes.find(s => s.id === sizeId)?.display_name || 'غير محدد';
  };

  const getColorHex = (colorId: number | null) => {
    return colors.find(c => c.id === colorId)?.hex_code || '#000000';
  };

  if (!hasVariants) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">متغيرات المنتج (الألوان والأحجام)</h2>
        </div>

        <div className="text-center py-8">
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              هل تريد إضافة ألوان وأحجام للمنتج؟
            </h3>
            <p className="text-gray-500 mb-4">
              يمكنك إنشاء متغيرات مختلفة للمنتج بألوان وأحجام متنوعة
            </p>
            <button
              type="button"
              onClick={() => setHasVariants(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              إضافة متغيرات للمنتج
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">متغيرات المنتج (الألوان والأحجام)</h2>
        </div>
        <button
          type="button"
          onClick={() => setHasVariants(false)}
          className="text-gray-500 hover:text-red-500 transition-colors duration-200"
          title="إلغاء المتغيرات"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Add New Variant Form */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-purple-600" />
          إضافة متغير جديد
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              اللون
            </label>
            <select
              value={newVariant.color_id || ''}
              onChange={(e) => setNewVariant({ ...newVariant, color_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">اختر اللون</option>
              {colors.map(color => (
                <option key={color.id} value={color.id}>
                  {color.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="w-4 h-4 inline mr-1" />
              الحجم
            </label>
            <select
              value={newVariant.size_id || ''}
              onChange={(e) => setNewVariant({ ...newVariant, size_id: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">اختر الحجم</option>
              {sizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر (دج)
            </label>
            <input
              type="number"
              value={newVariant.price || ''}
              onChange={(e) => setNewVariant({ ...newVariant, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0.00"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية
            </label>
            <input
              type="number"
              value={newVariant.quantity || ''}
              onChange={(e) => setNewVariant({ ...newVariant, quantity: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={addVariant}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة متغير
          </button>
        </div>
      </div>

      {/* Variants List */}
      {variants.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">المتغيرات المضافة</h3>
          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={variant.id || `variant-${index}-${variant.color_id}-${variant.size_id}`} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Color indicator */}
                    {variant.color_id && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: getColorHex(variant.color_id) }}
                        ></div>
                        <span className="text-sm font-medium">{getColorName(variant.color_id)}</span>
                      </div>
                    )}
                    
                    {/* Size */}
                    {variant.size_id && (
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{getSizeName(variant.size_id)}</span>
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>السعر: {variant.price} دج</span>
                      <span>الكمية: {variant.quantity}</span>
                      <span>SKU: {variant.sku}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="حذف المتغير"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantsManager;