// مساعد العملة المغربية
export const CURRENCY = {
  code: process.env.NEXT_PUBLIC_CURRENCY_CODE || 'MAD',
  symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'د.م.',
  name: process.env.NEXT_PUBLIC_CURRENCY_NAME || 'درهم مغربي',
  locale: process.env.NEXT_PUBLIC_CURRENCY_LOCALE || 'ar-MA'
};

/**
 * تنسيق السعر بالدرهم المغربي
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '0 د.م.';
  
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice).replace('MAD', 'د.م.');
};

/**
 * تنسيق السعر بدون رمز العملة
 */
export const formatPriceNumber = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '0';
  
  return new Intl.NumberFormat('ar-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice);
};

/**
 * تحويل السعر من نص إلى رقم
 */
export const parsePrice = (price: string): number => {
  const cleaned = price.replace(/[^\d.,]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * التحقق من صحة السعر
 */
export const isValidPrice = (price: number | string): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice >= 0;
};

/**
 * حساب الخصم
 */
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= 0 || salePrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * تنسيق نسبة الخصم
 */
export const formatDiscount = (originalPrice: number, salePrice: number): string => {
  const discount = calculateDiscount(originalPrice, salePrice);
  return discount > 0 ? `${discount}%-` : '';
};