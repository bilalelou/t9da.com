# API Documentation - Checkout System

## Overview
تم إنشاء نظام Checkout متكامل يتضمن:
- صفحة مراجعة الطلب النهائية (Frontend)
- API endpoints للطلبات والكوبونات (Backend)
- تحديث قاعدة البيانات لدعم النظام

## Frontend Pages

### 1. Order Final Review Page
**Path:** `/order-final`
**File:** `frontend/src/app/(public)/order-final/page.tsx`

**Features:**
- عرض تفاصيل الطلب قبل التأكيد النهائي
- إمكانية تعديل الكمية أو حذف المنتجات
- عرض معلومات الشحن مع إمكانية التعديل
- حساب ملخص الطلب (المجموع الفرعي، الشحن، الضريبة، الخصم)
- تأكيد الطلب مع نافذة تأكيد
- تصميم responsive يدعم الهاتف المحمول

## Backend API Endpoints

### 1. Validate Coupon
**URL:** `POST /api/validate-coupon`
**Authentication:** Public (لا يحتاج تسجيل دخول)

**Request Body:**
```json
{
  "code": "WELCOME10",
  "total": 200
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "discount": 20,
    "code": "WELCOME10",
    "description": "خصم 10% للعملاء الجدد"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "كوبون الخصم غير صحيح أو منتهي الصلاحية"
}
```

### 2. Get Shipping Costs
**URL:** `POST /api/shipping-costs`
**Authentication:** Public

**Request Body:**
```json
{
  "city": "الدار البيضاء",
  "total": 300
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "standard": "30.00",
    "express": 60,
    "overnight": 80,
    "free_shipping_threshold": 500
  }
}
```

### 3. Create Order
**URL:** `POST /api/orders`
**Authentication:** Required (Sanctum token)

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 150.00
    }
  ],
  "shipping_info": {
    "fullName": "احمد محمد",
    "email": "ahmed@example.com",
    "phone": "0612345678",
    "address": "شارع محمد الخامس، رقم 123",
    "city": "الدار البيضاء",
    "state": "الدار البيضاء-سطات",
    "postalCode": "20000",
    "shippingMethod": "standard",
    "paymentMethod": "cash_on_delivery"
  },
  "order_summary": {
    "subtotal": 300.00,
    "shipping": 30.00,
    "tax": 60.00,
    "discount": 0.00,
    "total": 390.00
  }
}
```

### 4. Other Order Endpoints
- `GET /api/orders` - قائمة الطلبات (Admin only)
- `GET /api/orders/{id}` - تفاصيل طلب محدد
- `PUT /api/orders/{id}/status` - تحديث حالة الطلب

## Database Updates

### Orders Table
تم إضافة الحقول التالية:
- `order_number` - رقم الطلب الفريد
- `status` - حالة الطلب (pending, confirmed, processing, shipped, delivered, cancelled)
- `subtotal` - المجموع الفرعي
- `shipping_cost` - تكلفة الشحن
- `tax_amount` - مبلغ الضريبة
- `discount_amount` - مبلغ الخصم
- معلومات الشحن (shipping_name, shipping_email, shipping_phone, etc.)
- `payment_method` - طريقة الدفع
- `payment_status` - حالة الدفع

### Order Items Table
تم إضافة:
- `price` - سعر المنتج وقت الطلب
- `total` - المجموع لهذا المنتج

### Coupons Table
تم تحديث وإضافة:
- `description` - وصف الكوبون
- `type` - نوع الخصم (percentage, fixed)
- `min_amount` - الحد الأدنى للطلب
- `max_amount` - الحد الأقصى للخصم

### Shipping Fees Table
تم إضافة:
- `city` - المدينة

## Sample Data

### Coupons
- `WELCOME10` - خصم 10% للعملاء الجدد
- `SAVE50` - خصم 50 درهم على الطلبات أكثر من 300 درهم
- `BIGDEAL` - خصم 20% على الطلبات أكثر من 500 درهم
- `FREESHIP` - شحن مجاني

### Shipping Fees
- الدار البيضاء: 30 درهم
- الرباط: 40 درهم
- فاس: 50 درهم
- مراكش: 45 درهم
- وأكثر...

## Integration Notes

### Frontend Integration
1. تأكد من تحديث `lib/api.ts` ليتضمن functions الجديدة
2. استخدم cart context للحصول على المنتجات
3. احفظ معلومات الشحن في localStorage
4. استخدم router للانتقال بين الصفحات

### Backend Integration
1. تأكد من تشغيل `php artisan migrate` لتحديث قاعدة البيانات
2. شغل seeders لإضافة البيانات التجريبية
3. تأكد من وجود CORS headers للتطبيق الأمامي

## Testing
تم اختبار جميع endpoints وهي تعمل بشكل صحيح:
- ✅ validate-coupon endpoint
- ✅ shipping-costs endpoint  
- ✅ Database migrations
- ✅ Sample data seeding

## Next Steps
1. ربط Frontend بـ Backend APIs
2. إضافة payment gateway integration
3. إضافة email notifications للطلبات
4. إضافة order tracking system