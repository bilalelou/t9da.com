<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

echo "👨‍💼 إنشاء مستخدم إداري...\n\n";

try {
    // التحقق من وجود المستخدم الإداري
    $adminExists = DB::table('users')->where('email', 'admin@t9da.com')->exists();

    if (!$adminExists) {
        $adminId = DB::table('users')->insertGetId([
            'name' => 'المدير العام',
            'email' => 'admin@t9da.com',
            'email_verified_at' => now(),
            'password' => Hash::make('admin123'),
            'phone' => '0600000001',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "✅ تم إنشاء المستخدم الإداري بنجاح!\n";
        echo "   الإيميل: admin@t9da.com\n";
        echo "   كلمة المرور: admin123\n";
        echo "   معرف المستخدم: {$adminId}\n";
    } else {
        echo "ℹ️ المستخدم الإداري موجود بالفعل\n";
        echo "   الإيميل: admin@t9da.com\n";
        echo "   كلمة المرور: admin123\n";
    }

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
}
