# قائمة التحقق النهائية لإصلاح مشكلة CORS مع Laravel Sanctum

## ✅ الملفات المحدثة

- [x] `backend/config/cors.php` - تم تحديثه مع `sanctum/csrf-cookie` و `supports_credentials: true`
- [x] `backend/config/sanctum.php` - تم تحديثه مع النطاقات الصحيحة
- [x] `backend/app/Models/User.php` - تم إضافة traits للـ Sanctum والأدوار
- [x] `backend/app/Http/Controllers/Api/LoginController.php` - تم تحديثه مع إنشاء التوكن

## 📝 الملفات المطلوب إنشاؤها

### 1. ملف backend/.env
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# إعدادات قاعدة البيانات
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommers
DB_USERNAME=root
DB_PASSWORD=

# إعدادات الجلسة
SESSION_DRIVER=file
SESSION_LIFETIME=120

# إعدادات Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# إعدادات الجلسة
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax
```

### 2. ملف frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## 🔧 الأوامر المطلوب تنفيذها

### في مجلد backend:
```bash
# 1. إنشاء مفتاح التطبيق
php artisan key:generate

# 2. تنظيف الكاش
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# 3. تشغيل الهجرات
php artisan migrate

# 4. إنشاء البيانات الأولية
php artisan db:seed --class=RolesAndUsersSeeder

# 5. تشغيل السيرفر
php artisan serve
```

### في مجلد frontend:
```bash
# 1. تشغيل السيرفر
npm run dev
```

## 🧪 اختبار الإصلاح

### 1. اختبار CSRF Cookie:
```bash
curl -c cookies.txt -b cookies.txt http://127.0.0.1:8000/sanctum/csrf-cookie
```

### 2. اختبار تسجيل الدخول:
```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b cookies.txt \
  -d '{"email":"admin@t9da.com","password":"password"}'
```

### 3. اختبار الوصول للمستخدم:
```bash
curl -X GET http://127.0.0.1:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 📋 قائمة التحقق النهائية

- [ ] تم إنشاء ملف `backend/.env` مع الإعدادات الصحيحة
- [ ] تم إنشاء ملف `frontend/.env.local` مع رابط API صحيح
- [ ] تم توليد مفتاح التطبيق بـ `php artisan key:generate`
- [ ] تم تنظيف الكاش في Laravel
- [ ] تم تشغيل الهجرات بنجاح
- [ ] تم إنشاء المستخدمين والأدوار بنجاح
- [ ] سيرفر Laravel يعمل على المنفذ 8000
- [ ] سيرفر Next.js يعمل على المنفذ 3000
- [ ] تم اختبار CSRF cookie بنجاح
- [ ] تم اختبار تسجيل الدخول بنجاح
- [ ] تم اختبار الوصول للمستخدم بنجاح

## 🚨 استكشاف الأخطاء

### إذا استمرت مشكلة CORS:
1. تأكد من أن `supports_credentials: true` في `config/cors.php`
2. تأكد من أن `SANCTUM_STATEFUL_DOMAINS` يحتوي على النطاق الصحيح
3. تأكد من أن `SESSION_DOMAIN` مضبوط على `localhost`
4. تأكد من أن `SESSION_SAME_SITE` مضبوط على `lax`

### إذا فشل تسجيل الدخول:
1. تأكد من أن قاعدة البيانات تعمل
2. تأكد من أن المستخدمين تم إنشاؤهم بنجاح
3. تأكد من أن الأدوار تم إنشاؤها بنجاح
4. تحقق من سجلات الأخطاء في Laravel

### إذا فشل إنشاء التوكن:
1. تأكد من أن trait `HasApiTokens` مضاف لـ User model
2. تأكد من أن جدول `personal_access_tokens` موجود
3. تأكد من أن Sanctum تم تثبيته بشكل صحيح

## 📞 معلومات الاتصال

إذا استمرت المشكلة، تحقق من:
- سجلات الأخطاء في Laravel (`storage/logs/laravel.log`)
- وحدة تحكم المتصفح (Console) للأخطاء
- Network tab في أدوات المطور للطلبات الفاشلة

