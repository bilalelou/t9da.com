<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

try {
    echo "🔍 فحص المستخدمين الموجودين في قاعدة البيانات:\n\n";

    $users = DB::table('users')->select('id', 'name', 'email', 'created_at')->get();

    if ($users->count() > 0) {
        echo "👥 المستخدمين الموجودين:\n";
        foreach ($users as $user) {
            echo "  - ID: {$user->id}\n";
            echo "    الاسم: {$user->name}\n";
            echo "    الإيميل: {$user->email}\n";
            echo "    تاريخ الإنشاء: {$user->created_at}\n\n";
        }
    } else {
        echo "❌ لا يوجد مستخدمين في قاعدة البيانات!\n\n";

        echo "🛠️ سأقوم بإنشاء مستخدم تجريبي...\n";

        // إنشاء مستخدم تجريبي
        $userId = DB::table('users')->insertGetId([
            'name' => 'مستخدم تجريبي',
            'email' => 'test@t9da.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone' => '0600000000',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "✅ تم إنشاء مستخدم تجريبي:\n";
        echo "   الإيميل: test@t9da.com\n";
        echo "   كلمة المرور: password\n";
        echo "   معرف المستخدم: {$userId}\n";
    }

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
}
