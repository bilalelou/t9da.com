# إعداد Laravel Sanctum و CORS

## 1. إنشاء ملف .env

قم بإنشاء ملف `.env` في مجلد `backend` مع المحتوى التالي:

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

## 2. إنشاء ملف .env.local في Next.js

قم بإنشاء ملف `.env.local` في مجلد `frontend` مع المحتوى التالي:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## 3. توليد مفتاح التطبيق

```bash
cd backend
php artisan key:generate
```

## 4. تنظيف الكاش

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## 5. تشغيل الهجرات

```bash
php artisan migrate
php artisan db:seed --class=RolesAndUsersSeeder
```

## 6. تشغيل السيرفرات

1. شغل سيرفر Laravel:
```bash
cd backend
php artisan serve
```

2. شغل سيرفر Next.js:
```bash
cd frontend
npm run dev
```

## ملاحظات مهمة

- تأكد من أن سيرفر Laravel يعمل على المنفذ 8000
- تأكد من أن سيرفر Next.js يعمل على المنفذ 3000
- تأكد من أن قاعدة البيانات تعمل وتحتوي على الجداول المطلوبة
- تأكد من أن المستخدمين والأدوار تم إنشاؤها بنجاح
