<?php
/**
 * Script لإصلاح مشكلة الأدوار في الخادم
 * يجب تشغيله مرة واحدة فقط بعد git pull
 */

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

echo "🔧 بدء إصلاح مشكلة الأدوار...\n\n";

try {
    // 1. إنشاء الأدوار للحارس sanctum
    echo "1️⃣ إنشاء الأدوار للحارس sanctum...\n";

    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'sanctum']);
    $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'sanctum']);

    echo "   ✅ تم إنشاء أدوار admin و customer للحارس sanctum\n\n";

    // 2. إعطاء المستخدمين الحاليين أدوار sanctum
    echo "2️⃣ إعطاء المستخدمين الحاليين أدوار sanctum...\n";

    $users = User::with('roles')->get();
    $updatedUsers = 0;

    foreach ($users as $user) {
        $webRoles = $user->roles()->where('guard_name', 'web')->pluck('name');

        foreach ($webRoles as $roleName) {
            $sanctumRole = Role::where('name', $roleName)->where('guard_name', 'sanctum')->first();

            if ($sanctumRole) {
                $exists = DB::table('model_has_roles')
                    ->where('role_id', $sanctumRole->id)
                    ->where('model_type', 'App\Models\User')
                    ->where('model_id', $user->id)
                    ->exists();

                if (!$exists) {
                    DB::table('model_has_roles')->insert([
                        'role_id' => $sanctumRole->id,
                        'model_type' => 'App\Models\User',
                        'model_id' => $user->id,
                    ]);
                    echo "   ✅ أُعطي المستخدم {$user->name} دور {$roleName} للحارس sanctum\n";
                    $updatedUsers++;
                }
            }
        }
    }

    echo "   📊 تم تحديث {$updatedUsers} مستخدم\n\n";

    // 3. التحقق من النتائج
    echo "3️⃣ التحقق من النتائج...\n";

    $allRoles = Role::all(['name', 'guard_name']);
    echo "   📋 الأدوار الموجودة الآن:\n";

    foreach ($allRoles as $role) {
        echo "      - {$role->name} (حارس: {$role->guard_name})\n";
    }

    echo "\n🎉 تم إصلاح المشكلة بنجاح!\n";
    echo "💡 يمكنك الآن الوصول إلى صفحة المستخدمين في لوحة التحكم بدون مشاكل.\n";

    // حذف هذا الملف بعد التشغيل الناجح
    echo "\n🗑️  حذف ملف الإصلاح...\n";
    unlink(__FILE__);
    echo "   ✅ تم حذف ملف الإصلاح\n";

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    echo "📝 تحقق من الـ logs للمزيد من التفاصيل\n";
}

echo "\n🏁 انتهى\n";
