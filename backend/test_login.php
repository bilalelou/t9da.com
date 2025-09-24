<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Hash;
use App\Models\User;

echo "🔍 اختبار تسجيل الدخول:\n\n";

try {
    $email = 'test@t9da.com';
    $password = 'password';

    echo "📧 البحث عن المستخدم: {$email}\n";

    $user = User::where('email', $email)->first();

    if ($user) {
        echo "✅ المستخدم موجود!\n";
        echo "   الاسم: {$user->name}\n";
        echo "   الإيميل: {$user->email}\n";
        echo "   نشط: " . ($user->is_active ? 'نعم' : 'لا') . "\n";

        echo "\n🔒 اختبار كلمة المرور...\n";

        if (Hash::check($password, $user->password)) {
            echo "✅ كلمة المرور صحيحة!\n";

            // اختبار إنشاء token
            $token = $user->createToken('test-token')->plainTextToken;
            echo "🎫 Token تم إنشاؤه بنجاح: " . substr($token, 0, 20) . "...\n";

        } else {
            echo "❌ كلمة المرور خاطئة!\n";

            // إعادة تعيين كلمة المرور
            echo "🛠️ إعادة تعيين كلمة المرور...\n";
            $user->password = Hash::make($password);
            $user->save();
            echo "✅ تم إعادة تعيين كلمة المرور!\n";
        }

    } else {
        echo "❌ المستخدم غير موجود!\n";
    }

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "📝 بيانات تسجيل الدخول:\n";
echo "   الإيميل: test@t9da.com\n";
echo "   كلمة المرور: password\n";
echo str_repeat("=", 50) . "\n";
