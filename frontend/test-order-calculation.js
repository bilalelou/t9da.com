// اختبار حساب الطلب
const calculateOrderTotal = (
  subtotal,
  shipping = 0,
  discount = 0,
  paymentFees = 0,
  tax = 0
) => {
  const validSubtotal = Number(subtotal) || 0;
  const validShipping = Number(shipping) || 0;
  const validDiscount = Number(discount) || 0;
  const validPaymentFees = Number(paymentFees) || 0;
  const validTax = Number(tax) || 0;

  const total = validSubtotal + validShipping + validPaymentFees + validTax - validDiscount;

  return {
    subtotal: validSubtotal,
    shipping: validShipping,
    discount: validDiscount,
    paymentFees: validPaymentFees,
    tax: validTax,
    total: Math.max(0, total)
  };
};

// اختبار السيناريوهات
console.log('🧪 اختبار حساب الطلب:');
console.log('');

// سيناريو 1: طلب عادي بدون رسوم
const test1 = calculateOrderTotal(100, 20, 0, 0, 0);
console.log('📦 سيناريو 1 - طلب عادي:');
console.log('   المجموع الفرعي: 100');
console.log('   الشحن: 20');
console.log('   النتيجة:', test1);
console.log('   المتوقع: 120');
console.log('   ✅ صحيح:', test1.total === 120);
console.log('');

// سيناريو 2: طلب مع رسوم دفع
const test2 = calculateOrderTotal(100, 20, 0, 15, 0);
console.log('💳 سيناريو 2 - طلب مع رسوم دفع:');
console.log('   المجموع الفرعي: 100');
console.log('   الشحن: 20');
console.log('   رسوم الدفع: 15');
console.log('   النتيجة:', test2);
console.log('   المتوقع: 135');
console.log('   ✅ صحيح:', test2.total === 135);
console.log('');

// سيناريو 3: طلب مع خصم
const test3 = calculateOrderTotal(100, 20, 10, 15, 0);
console.log('🎫 سيناريو 3 - طلب مع خصم:');
console.log('   المجموع الفرعي: 100');
console.log('   الشحن: 20');
console.log('   الخصم: 10');
console.log('   رسوم الدفع: 15');
console.log('   النتيجة:', test3);
console.log('   المتوقع: 125');
console.log('   ✅ صحيح:', test3.total === 125);
console.log('');

// اختبار حساب رسوم الدفع
const calculatePaymentFees = (subtotal, percentage, fixed) => {
  const percentageFee = (subtotal * percentage) / 100;
  return percentageFee + fixed;
};

console.log('💳 اختبار حساب رسوم الدفع:');
console.log('');

// بطاقة ائتمان: 2.5% + 5 درهم
const creditCardFees = calculatePaymentFees(100, 2.5, 5);
console.log('💳 بطاقة ائتمان (100 درهم):');
console.log('   النسبة: 2.5%');
console.log('   الرسوم الثابتة: 5');
console.log('   الرسوم المحسوبة:', creditCardFees);
console.log('   المتوقع: 7.5');
console.log('   ✅ صحيح:', creditCardFees === 7.5);
console.log('');

// تحويل بنكي: 0% + 10 درهم
const bankTransferFees = calculatePaymentFees(100, 0, 10);
console.log('🏦 تحويل بنكي (100 درهم):');
console.log('   النسبة: 0%');
console.log('   الرسوم الثابتة: 10');
console.log('   الرسوم المحسوبة:', bankTransferFees);
console.log('   المتوقع: 10');
console.log('   ✅ صحيح:', bankTransferFees === 10);
console.log('');

// دفع عند الاستلام: 0% + 0 درهم
const codFees = calculatePaymentFees(100, 0, 0);
console.log('📦 دفع عند الاستلام (100 درهم):');
console.log('   النسبة: 0%');
console.log('   الرسوم الثابتة: 0');
console.log('   الرسوم المحسوبة:', codFees);
console.log('   المتوقع: 0');
console.log('   ✅ صحيح:', codFees === 0);
console.log('');

console.log('🎯 جميع الاختبارات مكتملة!');