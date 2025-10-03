@echo off
echo تنظيف ملفات backend غير الضرورية...

REM حذف ملفات التطوير والاختبار
del /f check_and_fix_reviews_table.php 2>nul
del /f check_table_structure.php 2>nul
del /f check_table.php 2>nul
del /f check_users.php 2>nul
del /f check_variants.php 2>nul
del /f check_videos.php 2>nul
del /f create_admin.php 2>nul
del /f create_basic_data.php 2>nul
del /f create_test_product_with_variants.php 2>nul
del /f create_test_product.php 2>nul
del /f debug_product_api.php 2>nul
del /f fix_product_reviews_table.php 2>nul
del /f fix_roles_issue.php 2>nul
del /f fix_variants_table.php 2>nul
del /f test_api_directly.php 2>nul
del /f test_api_endpoints.php 2>nul
del /f test_login.php 2>nul
del /f test_reviews_table.php 2>nul
del /f test_system.php 2>nul
del /f test_videos_api.php 2>nul
del /f update_free_shipping.php 2>nul
del /f update_status_values.php 2>nul

REM حذف ملفات التوثيق
del /f CHANGELOG.md 2>nul
del /f FREE_SHIPPING_GUIDE.md 2>nul
del /f SANCTUM_SETUP.md 2>nul

REM حذف ملفات التكوين للتطوير
del /f .styleci.yml 2>nul
del /f postcss.config.js 2>nul
del /f tailwind.config.js 2>nul
del /f vite.config.js 2>nul
del /f package.json 2>nul
del /f package-lock.json 2>nul

REM حذف مجلد workflows
rmdir /s /q workflows 2>nul

REM حذف مجلد tests
rmdir /s /q tests 2>nul

REM تنظيف ملفات storage المؤقتة
del /f storage\logs\laravel.log 2>nul
del /f storage\framework\views\*.php 2>nul

echo تم الانتهاء من التنظيف!
pause