/**
 * حساب إجمالي الطلب بشكل صحيح
 */
export interface OrderCalculation {
  subtotal: number;
  shipping: number;
  discount: number;
  paymentFees: number;
  tax: number;
  total: number;
}

export const calculateOrderTotal = (
  subtotal: number,
  shipping: number = 0,
  discount: number = 0,
  paymentFees: number = 0,
  tax: number = 0
): OrderCalculation => {
  // التأكد من أن جميع القيم أرقام صحيحة
  const validSubtotal = Number(subtotal) || 0;
  const validShipping = Number(shipping) || 0;
  const validDiscount = Number(discount) || 0;
  const validPaymentFees = Number(paymentFees) || 0;
  const validTax = Number(tax) || 0;

  // حساب الإجمالي: المجموع الفرعي + الشحن + رسوم الدفع + الضريبة - الخصم
  const total = validSubtotal + validShipping + validPaymentFees + validTax - validDiscount;

  return {
    subtotal: validSubtotal,
    shipping: validShipping,
    discount: validDiscount,
    paymentFees: validPaymentFees,
    tax: validTax,
    total: Math.max(0, total) // التأكد من أن الإجمالي لا يكون سالباً
  };
};

/**
 * تنسيق العملة
 */
export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  try {
    if (currency === 'MAD') {
      return new Intl.NumberFormat('ar-MA', { 
        style: 'currency', 
        currency: 'MAD' 
      }).format(amount).replace('MAD', 'د.م.');
    }
    return new Intl.NumberFormat('ar-MA', { 
      style: 'currency', 
      currency 
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency === 'MAD' ? 'د.م.' : currency}`;
  }
};