# نظام الإشعارات - دليل الاستخدام 📢

تم إنشاء نظام شامل للإشعارات في لوحة تحكم الـ admin بنجاح! 

## ✨ الميزات المتوفرة

### 🎯 أنواع الإشعارات
- **طلبات**: إشعارات عند إنشاء أو تحديث الطلبات
- **مستخدمين**: إشعارات عند انضمام مستخدمين جدد
- **منتجات**: إشعارات نفاد المخزون ومنتجات جديدة
- **نظام**: إشعارات نجاح/خطأ/تحذير/معلومات

### 🎨 مستويات الأولوية
- 🔴 **عاجلة**: للأمور الحرجة
- 🟠 **عالية**: للأمور المهمة
- 🟡 **متوسطة**: للأمور العادية
- ⚪ **منخفضة**: للمعلومات العامة

### 📊 صفحة الإشعارات
- عرض جميع الإشعارات مع التصفية والبحث
- إحصائيات شاملة (إجمالي، غير مقروءة، اليوم، عاجلة)
- إمكانية تحديد كمقروء/غير مقروء
- حذف الإشعارات المفردة أو المجمعة
- Pagination للإشعارات الكثيرة

### 🔔 قائمة الإشعارات في Header
- dropdown يظهر آخر 10 إشعارات
- عداد الإشعارات غير المقروءة
- تحديث تلقائي كل 30 ثانية
- إمكانية تحديد كمقروء مباشرة

## 🛠️ التقنيات المستخدمة

### Backend (Laravel)
- **Model**: `App\Models\Notification`
- **Controller**: `App\Http\Controllers\Api\NotificationController`
- **Observer**: `App\Observers\OrderObserver` (للطلبات)
- **Helper**: `App\Helpers\NotificationHelper`
- **Command**: `php artisan notifications:cleanup`
- **Migration**: `2025_09_19_002800_create_notifications_table`
- **Seeder**: `NotificationSeeder`

### Frontend (Next.js)
- **صفحة الإشعارات**: `/admin/notifications`
- **Component**: `NotificationDropdown` في الـ header
- **التحديث التلقائي**: كل 30 ثانية
- **التصفية والبحث**: في الوقت الفعلي

## 🚀 كيفية الاستخدام

### إنشاء إشعار برمجياً
```php
use App\Helpers\NotificationHelper;

// إشعار طلب جديد
NotificationHelper::newOrder($order);

// إشعار نفاد مخزون
NotificationHelper::lowStock($product, $currentStock);

// إشعار خطأ في النظام
NotificationHelper::systemError('خطأ في الدفع', 'فشل في معالجة الدفع للطلب #123');

// إشعار نجاح
NotificationHelper::systemSuccess('تحديث ناجح', 'تم تحديث النظام بنجاح');
```

### الأوامر المتاحة
```bash
# تنظيف الإشعارات المقروءة القديمة (أقدم من 30 يوم)
php artisan notifications:cleanup

# تنظيف فوري بدون تأكيد
php artisan notifications:cleanup --force

# تنظيف الإشعارات الأقدم من 60 يوم
php artisan notifications:cleanup --days=60
```

### API Endpoints
```
GET    /api/notifications              # جلب جميع الإشعارات مع الفلاتر
POST   /api/notifications              # إنشاء إشعار جديد
GET    /api/notifications/{id}         # جلب إشعار محدد
PUT    /api/notifications/{id}         # تحديث إشعار
DELETE /api/notifications/{id}         # حذف إشعار

POST   /api/notifications/{id}/mark-as-read     # تحديد كمقروء
POST   /api/notifications/{id}/mark-as-unread   # تحديد كغير مقروء
POST   /api/notifications/mark-all-as-read      # تحديد الكل كمقروء
DELETE /api/notifications/delete-read           # حذف جميع المقروءة
GET    /api/notifications-recent                # آخر 10 إشعارات للـ header
```

## 🔄 الإشعارات التلقائية

### طلبات جديدة
- يتم إنشاء إشعار تلقائياً عند إنشاء طلب جديد
- إشعار إضافي للطلبات عالية القيمة (>= 1000 ريال)

### تحديث حالة الطلبات
- إشعار عند تغيير حالة الطلب
- أولوية عالية للطلبات الملغية

### نفاد المخزون
- يمكن إضافة منطق في ProductObserver للتحقق من المخزون

## 📈 الإحصائيات

النظام يوفر إحصائيات شاملة:
- إجمالي الإشعارات
- الإشعارات غير المقروءة
- إشعارات اليوم
- الإشعارات العاجلة
- توزيع الإشعارات حسب النوع

## 🎨 التصميم والUX

- تصميم responsive يعمل على جميع الشاشات
- ألوان مختلفة لكل نوع إشعار
- أيقونات واضحة ومعبرة
- animation سلس للتفاعلات
- توقيت نسبي للإشعارات (منذ 5 دقائق، منذ ساعتين...)

## 🔧 التخصيص

يمكن بسهولة:
- إضافة أنواع إشعارات جديدة
- تخصيص ألوان وأيقونات
- إضافة فلاتر جديدة
- ربط إشعارات بنماذج أخرى
- إضافة Actions مخصصة

## 📱 التطوير المستقبلي

يمكن إضافة:
- ✉️ إرسال إشعارات عبر البريد الإلكتروني
- 📱 Push notifications للمتصفح
- 🔔 إشعارات صوتية
- 📊 تقارير تفصيلية للإشعارات
- 🤖 إشعارات ذكية بناءً على سلوك المستخدم

---

تم إنشاء النظام بحب ❤️ ويجب تشغيل الأوامر التالية لضمان العمل:

```bash
php artisan migrate              # لإنشاء جدول الإشعارات
php artisan db:seed --class=NotificationSeeder  # لإضافة بيانات تجريبية
```

🎉 **نظام الإشعارات جاهز للاستخدام!**