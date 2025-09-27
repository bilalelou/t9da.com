# ميزة الشحن المجاني للمنتجات - دليل شامل

## 📦 نظرة عامة

تم إضافة ميزة الشحن المجاني للمنتجات في المتجر الإلكتروني، مما يتيح للمدير تحديد المنتجات التي تتضمن شحن مجاني وإدارتها بسهولة.

## 🗄️ التحديثات في قاعدة البيانات

### Migration الجديدة
```sql
ALTER TABLE products ADD COLUMN has_free_shipping BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN free_shipping_note TEXT NULL;
```

### الحقول المضافة:
- `has_free_shipping`: boolean - هل المنتج له شحن مجاني
- `free_shipping_note`: text - ملاحظة حول الشحن المجاني (اختيارية)

## 🏗️ التحديثات في الكود

### 1. Model التحديثات

**Product Model** (`app/Models/Product.php`):
```php
// Fillable fields جديدة
'has_free_shipping', 'free_shipping_note'

// Casts جديدة
'has_free_shipping' => 'boolean'

// Scopes جديدة
public function scopeFreeShipping($query)
public function scopePaidShipping($query)

// Methods مساعدة
public function hasFreeShipping()
public function getShippingCost($cityPrice = 0)
```

### 2. API Routes الجديدة

#### Public Routes:
```
GET /api/products/free-shipping/public  # جلب المنتجات مع شحن مجاني (عام)
```

#### Admin Routes:
```
GET    /api/products/free-shipping                    # جلب المنتجات مع شحن مجاني
POST   /api/products/{id}/toggle-free-shipping        # تفعيل/إلغاء الشحن المجاني
```

#### Updated Routes:
```
POST /api/shipping-costs  # تم تحديث حساب تكلفة الشحن
```

### 3. API Responses المحدثة

#### حساب تكلفة الشحن الجديد:
```json
{
    "success": true,
    "data": {
        "standard": 0,
        "express": 0,
        "overnight": 0,
        "free_shipping_threshold": null,
        "message": "شحن مجاني - جميع المنتجات تتضمن شحن مجاني",
        "has_free_shipping_products": true,
        "free_shipping_count": 2,
        "paid_shipping_count": 1
    }
}
```

#### جلب المنتجات مع الشحن المجاني:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "منتج مع شحن مجاني",
            "has_free_shipping": true,
            "free_shipping_note": "شحن مجاني لهذا المنتج في جميع أنحاء المملكة",
            "price": 199.99
        }
    ],
    "pagination": {
        "total": 5,
        "per_page": 12,
        "current_page": 1,
        "last_page": 1
    }
}
```

## 🎯 سيناريوهات الشحن

### 1. جميع المنتجات لها شحن مجاني
- تكلفة الشحن = 0 درهم
- رسالة: "شحن مجاني - جميع المنتجات تتضمن شحن مجاني"

### 2. بعض المنتجات لها شحن مجاني
- تكلفة الشحن = سعر المدينة
- رسالة: "الشحن مجاني لـ X من أصل Y منتجات"

### 3. لا توجد منتجات بشحن مجاني
- تكلفة الشحن = سعر المدينة العادي
- إمكانية الشحن المجاني عند تجاوز 500 درهم

### 4. تجاوز العتبة المجانية (500 درهم)
- تكلفة الشحن = 0 درهم للطلبات > 500 درهم
- رسالة: "شحن مجاني للطلبات أكثر من 500 درهم"

## 🔧 استخدام الـ API

### 1. تفعيل الشحن المجاني لمنتج:
```bash
POST /api/products/123/toggle-free-shipping
Content-Type: application/json
Authorization: Bearer {token}

{
    "has_free_shipping": true,
    "free_shipping_note": "شحن مجاني لهذا المنتج الخاص"
}
```

### 2. حساب تكلفة الشحن المحدثة:
```bash
POST /api/shipping-costs
Content-Type: application/json

{
    "city": "الدار البيضاء",
    "total": 250.00,
    "items": [
        {"id": 1, "quantity": 2},
        {"id": 2, "quantity": 1}
    ]
}
```

### 3. جلب المنتجات مع الشحن المجاني:
```bash
GET /api/products/free-shipping/public?per_page=12
```

## 📊 إحصائيات

يمكن الحصول على إحصائيات الشحن المجاني باستخدام:
```php
// في الكود
$freeShippingCount = Product::freeShipping()->count();
$paidShippingCount = Product::paidShipping()->count();
$freeShippingPercentage = ($freeShippingCount / Product::count()) * 100;
```

## 🎨 عرض الشحن المجاني في Frontend

### مؤشرات بصرية مقترحة:
- 🚚 أيقونة شاحنة مع "شحن مجاني"
- 🎯 Badge أخضر "Free Shipping"
- ✅ علامة صح مع النص
- 🆓 رمز FREE باللون المميز

### أماكن العرض:
1. **بطاقات المنتجات**: Badge صغير
2. **صفحة المنتج**: إعلان واضح
3. **السلة**: تمييز المنتجات مع شحن مجاني
4. **Checkout**: عرض توفير تكلفة الشحن

## 🔄 التحديثات المستقبلية

يمكن إضافة:
- 📅 تواريخ انتهاء الشحن المجاني
- 🏷️ شحن مجاني لفئات معينة
- 🎁 شحن مجاني كعرض ترويجي
- 📍 شحن مجاني لمناطق محددة فقط
- 💰 حد أدنى للشحن المجاني لكل منتج

## 🎯 فوائد الميزة

### للمتجر:
- ✅ زيادة المبيعات
- ✅ تحسين معدل التحويل
- ✅ جذب المزيد من العملاء
- ✅ تنافسية أفضل

### للعملاء:
- ✅ توفير في تكلفة الشحن
- ✅ تجربة شراء أفضل
- ✅ وضوح في التكلفة الإجمالية
- ✅ حافز إضافي للشراء

---

**🚀 الميزة جاهزة للاستخدام ومتكاملة مع النظام الحالي!**