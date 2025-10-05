@echo off
echo تشغيل إعداد قاعدة البيانات لإعدادات البنك...

echo.
echo 1. تشغيل migrations...
php artisan migrate --force

echo.
echo 2. تشغيل seeder لإعدادات البنك...
php artisan db:seed --class=InitializeBankSettingsSeeder

echo.
echo 3. مسح cache...
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo.
echo تم الانتهاء من إعداد إعدادات البنك بنجاح!
pause